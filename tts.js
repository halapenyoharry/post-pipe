// tts.js — Registry-based TTS module
// Engines self-describe their capabilities. UI renders what each engine exposes.
// Nothing loads until the engine is selected AND play is pressed.
//
// window.TTS = {
//   register(engine),         — add an engine to the registry
//   engines(),                — list registered engines with capabilities
//   select(id),               — choose engine (does NOT load it)
//   play(container, opts),    — lazy-loads if needed, then speaks
//   pause(), resume(), stop(),
//   set(param, value),        — set any engine parameter (speed, pitch, voice, quality, etc.)
//   get(param),               — read current value
//   capabilities(),           — returns current engine's declared capabilities
//   selected(),               — returns current engine id
//   on(event, fn),            — event: 'state', 'progress', 'ready', 'error', 'capabilitiesChanged'
// }
//
// Engine contract:
//   { id, label, capabilities, init(), speak(text, params), pause(), resume(), stop(), voices() }
//   init() is called once, lazily. Returns a promise.
//   speak(text, params) returns a promise that resolves when the sentence is done.
//   capabilities is a static descriptor — no function calls needed to read it.

(function () {
  'use strict';

  // ── Registry ───────────────────────────────────────────────────────────────
  const registry = {};
  let activeId = null;
  let activeEngine = null;
  let engineReady = false;
  let engineLoading = false;

  // ── Playback state ─────────────────────────────────────────────────────────
  let playing = false;
  let paused = false;
  let sentences = [];
  let sentenceIndex = 0;
  let scrollContainer = null;
  let params = {};  // current parameter values (speed, pitch, voice, quality, etc.)

  // ── Events ─────────────────────────────────────────────────────────────────
  const listeners = {};
  function emit(event, data) {
    (listeners[event] || []).forEach(fn => { try { fn(data); } catch(e) { console.error(e); } });
  }

  // ── Sentence extraction ────────────────────────────────────────────────────
  function extractSentences(container) {
    const result = [];
    const blockTags = new Set(['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'TD', 'TH']);

    function getBlockParent(node) {
      let p = node.parentElement;
      while (p && p !== container && !blockTags.has(p.tagName)) {
        p = p.parentElement;
      }
      return p || node.parentElement;
    }

    // Text nodes are joined as written: the spaces between words are already
    // in them, and a word drawn in two pieces (bold word beginnings) must read
    // as one word. A <br> counts as a space.
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node) {
        if (node.nodeType === 1) return node.tagName === 'BR' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NAV') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let currentBlockElement = null;
    let currentBlockText = '';

    function flushBlock() {
      currentBlockText = currentBlockText.replace(/\s+/g, ' ');
      if (currentBlockText.trim().length > 0) {
        const parts = currentBlockText.match(/[^.!?]*[.!?]+[\s]*/g);
        if (parts) {
          for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.length > 0) {
              result.push({ text: trimmed, block: currentBlockElement });
            }
          }
        } else {
          result.push({ text: currentBlockText.trim(), block: currentBlockElement });
        }
      }
      currentBlockText = '';
    }

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 1) { currentBlockText += ' '; continue; }
      if (node.textContent.trim().length === 0 && currentBlockText.length === 0) continue;
      const block = getBlockParent(node);
      if (block !== currentBlockElement) {
        flushBlock();
        currentBlockElement = block;
      }
      currentBlockText += node.textContent;
    }
    flushBlock();
    return result;
  }

  // ── Highlighting & scroll sync ─────────────────────────────────────────────
  let highlightBlock = null;
  let highlightMark = null;

  function highlightSentence(idx) {
    clearHighlight();
    if (idx < 0 || idx >= sentences.length) return;
    const s = sentences[idx];
    if (!s.block) return;
    
    highlightBlock = s.block;
    highlightBlock.dataset.originalBg = highlightBlock.style.backgroundColor || '';
    highlightBlock.style.backgroundColor = 'rgba(100, 255, 218, 0.15)';
    highlightBlock.dataset.originalRadius = highlightBlock.style.borderRadius || '';
    highlightBlock.style.borderRadius = '4px';

    if (scrollContainer && highlightBlock) {
      const cr = scrollContainer.getBoundingClientRect();
      const mr = highlightBlock.getBoundingClientRect();
      const rel = mr.top - cr.top;
      scrollContainer.scrollTo({ top: scrollContainer.scrollTop + rel - cr.height * 0.33, behavior: 'smooth' });
    }
  }

  function clearHighlight() {
    if (highlightBlock) {
      highlightBlock.style.backgroundColor = highlightBlock.dataset.originalBg;
      if (!highlightBlock.style.backgroundColor) highlightBlock.style.removeProperty('background-color');
      highlightBlock.style.borderRadius = highlightBlock.dataset.originalRadius;
      if (!highlightBlock.style.borderRadius) highlightBlock.style.removeProperty('border-radius');
      highlightBlock = null;
    }
    highlightMark = null;

    // Defensive sweep: ensure no orphaned <mark class="tts-active"> elements remain in DOM
    try {
      const marks = document.querySelectorAll('mark.tts-active');
      marks.forEach(m => {
        const p = m.parentNode;
        if (p) {
          while (m.firstChild) p.insertBefore(m.firstChild, m);
          p.removeChild(m);
          p.normalize();
        }
      });
    } catch (e) { /* ignore cleanup errors */ }
  }

  // ── Playback loop ──────────────────────────────────────────────────────────
  async function speakNext() {
    if (!playing || sentenceIndex >= sentences.length) {
      stopAll();
      return;
    }
    highlightSentence(sentenceIndex);
    emit('progress', { index: sentenceIndex, total: sentences.length });

    // Prefetch current sentence FIRST so it gets enqueued to the worker before the next sentence!
    if (activeEngine.prefetch) {
      activeEngine.prefetch(sentences[sentenceIndex].text, params).catch(()=>{});
      if (sentenceIndex + 1 < sentences.length) {
        activeEngine.prefetch(sentences[sentenceIndex + 1].text, params).catch(()=>{});
      }
    }

    try {
      await activeEngine.speak(sentences[sentenceIndex].text, params);
      sentenceIndex++;
      if (playing) speakNext();
    } catch (e) {
      emit('error', { engine: activeId, error: e.message });
      stopAll();
    }
  }

  async function ensureReady() {
    if (engineReady) return;
    if (engineLoading) {
      // Wait for it
      return new Promise((resolve, reject) => {
        const onReady = () => { off('ready', onReady); off('error', onErr); resolve(); };
        const onErr = (e) => { off('ready', onReady); off('error', onErr); reject(e); };
        const off = (evt, fn) => { listeners[evt] = (listeners[evt]||[]).filter(f => f !== fn); };
        (listeners.ready = listeners.ready || []).push(onReady);
        (listeners.error = listeners.error || []).push(onErr);
      });
    }
    engineLoading = true;
    emit('state', 'loading');
    try {
      await activeEngine.init(params);
      engineReady = true;
      engineLoading = false;
      emit('ready', { engine: activeId });
      emit('capabilitiesChanged', activeEngine.capabilities);
    } catch (e) {
      engineLoading = false;
      emit('error', { engine: activeId, error: e.message });
      throw e;
    }
  }

  function stopAll() {
    playing = false;
    paused = false;
    sentenceIndex = 0;
    if (activeEngine && activeEngine.stop) activeEngine.stop();
    clearHighlight();
    emit('progress', { index: 0, total: sentences.length });
    emit('state', 'stopped');
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  // Which engines the reader is allowed to see, and which one starts selected.
  // Both come from settings.json via window.TTS_CONFIG. An engine that is not
  // exposed still registers — it works if something selects it deliberately —
  // it simply never appears in the picker. That is the difference between an
  // engine being available and being offered to whoever was handed this page.
  function exposedIds() {
    const cfg = window.TTS_CONFIG || {};
    return Array.isArray(cfg.exposedEngines) ? cfg.exposedEngines : null;
  }

  function isExposed(id) {
    const allow = exposedIds();
    return allow === null ? true : allow.indexOf(id) !== -1;
  }

  window.TTS = {
    register: function (engine) {
      registry[engine.id] = engine;
      // Auto-select the configured default when it shows up; otherwise the
      // first exposed engine. Never auto-select a hidden one — landing on a
      // billed engine because it happened to register first is the bug this
      // whole split exists to prevent.
      // Engines register in whatever order their IIFEs run. Rather than try to
      // predict who is coming, take the first exposed one that shows up and
      // upgrade to the configured default if and when it appears. Always
      // terminates, and never lands on a hidden engine.
      const preferred = (window.TTS_CONFIG || {}).defaultEngine;
      const claim = !activeId || (engine.id === preferred && activeId !== preferred);
      if (claim && isExposed(engine.id)) {
        activeId = engine.id;
        activeEngine = engine;
        // Set default params from capabilities
        const caps = engine.capabilities || {};
        for (const [key, spec] of Object.entries(caps)) {
          if (spec && spec.default !== undefined && params[key] === undefined) {
            params[key] = spec.default;
          }
        }
      }
    },

    engines: function () {
      return Object.values(registry)
        .filter(e => isExposed(e.id))
        .map(e => ({
          id: e.id,
          label: e.label,
          capabilities: e.capabilities,
        }));
    },

    // Everything registered, exposed or not. For a host that wants to offer a
    // hidden engine deliberately — a build where the reader owns the key.
    allEngines: function () {
      return Object.values(registry).map(e => ({
        id: e.id,
        label: e.label,
        exposed: isExposed(e.id),
        capabilities: e.capabilities,
      }));
    },

    select: function (id) {
      if (!registry[id]) return;
      if (playing || paused) stopAll();
      activeId = id;
      activeEngine = registry[id];
      engineReady = false;
      engineLoading = false;
      // Reset params to this engine's defaults, keep user overrides where capability exists
      const caps = activeEngine.capabilities || {};
      const newParams = {};
      for (const [key, spec] of Object.entries(caps)) {
        if (spec && spec.default !== undefined) {
          // Keep user's value if they set one and this engine supports the param
          newParams[key] = params[key] !== undefined ? params[key] : spec.default;
        }
      }
      // Always carry voice — but clear it if switching engines (voices are engine-specific)
      delete newParams.voice;
      params = newParams;
      emit('capabilitiesChanged', caps);
    },

    selected: function () { return activeId; },

    capabilities: function () {
      return activeEngine ? activeEngine.capabilities : {};
    },

    play: async function (container, opts) {
      if (paused) {
        playing = true;
        paused = false;
        emit('state', 'playing');
        if (activeEngine.resume) {
          activeEngine.resume();
        } else {
          speakNext();
        }
        return;
      }

      scrollContainer = (opts && opts.scrollContainer) || container;
      if (opts && opts.onProgress) this.on('progress', opts.onProgress);
      if (opts && opts.onStateChange) this.on('state', opts.onStateChange);

      if (!activeEngine) return;

      sentences = extractSentences(container);
      if (!sentences.length) return;
      sentenceIndex = 0;
      playing = true;
      paused = false;

      try {
        emit('state', 'loading');
        await ensureReady();
        // After init, voices may now be available — notify UI
        emit('capabilitiesChanged', activeEngine.capabilities);
        emit('state', 'playing');
        speakNext();
      } catch (e) {
        emit('error', { engine: activeId, error: e.message });
        stopAll();
      }
    },

    pause: function () {
      paused = true;
      playing = false;
      if (activeEngine && activeEngine.pause) activeEngine.pause();
      emit('state', 'paused');
    },

    resume: function () {
      if (!paused) return;
      playing = true;
      paused = false;
      emit('state', 'playing');
      if (activeEngine && activeEngine.resume) {
        activeEngine.resume();
      } else {
        speakNext();
      }
    },

    stop: function () { stopAll(); },

    set: function (key, value) {
      params[key] = value;
      // If the engine has a live setter, call it
      if (activeEngine && activeEngine.onParamChange) {
        activeEngine.onParamChange(key, value, params);
      }
    },

    get: function (key) { return params[key]; },

    params: function () { return Object.assign({}, params); },

    voices: function () {
      if (!activeEngine || !activeEngine.voices) return [];
      return activeEngine.voices();
    },

    on: function (event, fn) {
      (listeners[event] = listeners[event] || []).push(fn);
    },

    off: function (event, fn) {
      if (listeners[event]) listeners[event] = listeners[event].filter(f => f !== fn);
    },

    isPlaying: function () { return playing; },
    isPaused: function () { return paused; },
  };

  // ─── Built-in engine: Browser (Web Speech API) ─────────────────────────────
  // Always available, zero download, instant.

  (function registerBrowser() {
    const synth = window.speechSynthesis;
    if (!synth) return;

    let currentUtterance = null;
    let resolveSpeak = null;
    let cachedVoices = [];

    function refreshVoices() { cachedVoices = synth.getVoices(); }
    synth.addEventListener('voiceschanged', refreshVoices);
    refreshVoices();

    // A few good English voices rather than every voice the device has.
    // TTS_CONFIG.preferredVoices is an ordered list of names; a device voice
    // matches a name exactly or by prefix ("Samantha (Enhanced)", "Microsoft
    // Aria Online (Natural) - English (United States)"). At most maxVoices
    // are offered, in the list's order; if none of them exist on this device,
    // one English voice is offered instead.
    const DEFAULT_PREFERRED = [
      'Samantha', 'Daniel', 'Karen', 'Moira', 'Tessa',
      'Google US English', 'Google UK English Female', 'Google UK English Male',
      'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Guy',
    ];
    function curatedVoices(all) {
      const cfg = window.TTS_CONFIG || {};
      const preferred = Array.isArray(cfg.preferredVoices) && cfg.preferredVoices.length
        ? cfg.preferredVoices : DEFAULT_PREFERRED;
      const max = Number.isFinite(cfg.maxVoices) && cfg.maxVoices > 0 ? cfg.maxVoices : 5;
      const english = all.filter(v => /^en([-_]|$)/i.test(v.lang || ''));
      const picked = [];
      for (const name of preferred) {
        if (picked.length >= max) break;
        const exact = english.find(v => v.name === name && picked.indexOf(v) === -1);
        const prefix = exact || english.find(v => v.name.indexOf(name) === 0 && picked.indexOf(v) === -1);
        if (prefix) picked.push(prefix);
      }
      if (!picked.length) {
        const fallback = english.find(v => v.default) || english[0] || all.find(v => v.default) || all[0];
        if (fallback) picked.push(fallback);
      }
      return picked;
    }

    function findDefaultBrowserVoice(allVoices) {
      const first = curatedVoices(allVoices)[0];
      return first ? first.name : null;
    }

    window.TTS.register({
      id: 'browser',
      label: 'Browser (Device)',
      capabilities: {
        speed:  { type: 'range', min: 0.5, max: 3, step: 0.1, default: 1, label: 'Speed' },
        pitch:  { type: 'range', min: 0, max: 2, step: 0.1, default: 1, label: 'Pitch' },
        volume: { type: 'range', min: 0, max: 1, step: 0.1, default: 1, label: 'Volume' },
        voice:  {
          type: 'voice',
          get default() {
            return findDefaultBrowserVoice(synth ? synth.getVoices() : []);
          },
          label: 'Voice'
        },
      },

      init: async function () {
        // Browser TTS is always ready — no model to load
        refreshVoices();
      },

      voices: function () {
        return curatedVoices(synth.getVoices()).map(v => ({
          id: v.name,
          label: v.name,
          lang: v.lang,
        }));
      },

      speak: function (text, p) {
        return new Promise((resolve, reject) => {
          synth.cancel();
          const utt = new SpeechSynthesisUtterance(text);
          if (p.voice) {
            const match = synth.getVoices().find(v => v.name === p.voice);
            if (match) utt.voice = match;
          }
          utt.rate = p.speed || 1;
          utt.pitch = p.pitch || 1;
          utt.volume = p.volume !== undefined ? p.volume : 1;
          utt.onend = () => { currentUtterance = null; resolve(); };
          utt.onerror = (e) => { currentUtterance = null; reject(e); };
          currentUtterance = utt;
          resolveSpeak = resolve;
          synth.speak(utt);
        });
      },

      pause: function () { synth.pause(); },
      resume: function () { synth.resume(); },
      stop: function () { synth.cancel(); currentUtterance = null; if (resolveSpeak) { resolveSpeak(); resolveSpeak = null; } },
    });
  })();

  // ── Gemini TTS Engine ──────────────────────────────────────────────────────
  (function registerGemini() {
    const cfg = window.TTS_CONFIG || {};
    const apiKey = cfg.geminiApiKey || '';
    const voiceList = cfg.geminiVoices || [];
    const defaultModel = cfg.geminiModel || 'gemini-2.5-flash-preview-tts';
    const defaultVoice = cfg.geminiDefaultVoice || 'Kore';

    let audioCtx = null;
    let currentSource = null;
    let pausedAt = 0;
    let startedAt = 0;
    let pausedBuffer = null;
    let paused = false;
    let resumeResolve = null;

    function getAudioCtx() {
      if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      }
      return audioCtx;
    }

    function pcmToWav(pcmBuffer) {
      const numChannels = 1, sampleRate = 24000, bitDepth = 16;
      const byteRate = sampleRate * numChannels * (bitDepth / 8);
      const blockAlign = numChannels * (bitDepth / 8);
      const dataLen = pcmBuffer.byteLength;
      const buffer = new ArrayBuffer(44 + dataLen);
      const view = new DataView(buffer);
      const write = (off, str) => [...str].forEach((c, i) => view.setUint8(off + i, c.charCodeAt(0)));
      const writeU32 = (off, v) => view.setUint32(off, v, true);
      const writeU16 = (off, v) => view.setUint16(off, v, true);
      write(0, 'RIFF'); writeU32(4, 36 + dataLen); write(8, 'WAVE');
      write(12, 'fmt '); writeU32(16, 16); writeU16(20, 1);
      writeU16(22, numChannels); writeU32(24, sampleRate); writeU32(28, byteRate);
      writeU16(32, blockAlign); writeU16(34, bitDepth);
      write(36, 'data'); writeU32(40, dataLen);
      new Uint8Array(buffer).set(new Uint8Array(pcmBuffer), 44);
      return buffer;
    }

    async function fetchAudio(text, params) {
      const voice = params.voice || defaultVoice;
      const model = params.model || defaultModel;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const body = {
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
        }
      };
      let attempts = 0;
      while (attempts < 3) {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        const b64 = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (b64) {
          const raw = atob(b64);
          const pcm = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) pcm[i] = raw.charCodeAt(i);
          return pcm.buffer;
        }
        attempts++;
      }
      throw new Error('Gemini TTS: no audio returned after 3 attempts');
    }

    async function playBuffer(pcmBuffer) {
      const ctx = getAudioCtx();
      const wav = pcmToWav(pcmBuffer);
      const audioBuffer = await ctx.decodeAudioData(wav);
      return new Promise((resolve, reject) => {
        currentSource = ctx.createBufferSource();
        currentSource.buffer = audioBuffer;
        currentSource.connect(ctx.destination);
        currentSource.onended = () => { currentSource = null; resolve(); };
        pausedBuffer = audioBuffer;
        startedAt = ctx.currentTime;
        pausedAt = 0;
        paused = false;
        currentSource.start(0);
      });
    }

    window.TTS.register({
      id: 'gemini',
      label: 'Google Gemini',

      capabilities: {
        voice: { type: 'voice', label: 'Voice', default: defaultVoice },
        model: {
          type: 'select',
          label: 'Model',
          default: defaultModel,
          options: [
            { value: 'gemini-2.5-flash-preview-tts', label: 'Gemini 2.5 Flash' },
            { value: 'gemini-2.5-pro-preview-tts',   label: 'Gemini 2.5 Pro' },
            { value: 'gemini-3.1-flash-tts-preview',  label: 'Gemini 3.1 Flash' }
          ]
        }
      },

      init: async function(params) {
        if (!apiKey) throw new Error('Gemini TTS: no API key. Set GEMINI_API_KEY in auth/.env and rebuild.');
        getAudioCtx();
      },

      speak: async function(text, params) {
        if (paused) {
          await new Promise(r => { resumeResolve = r; });
        }
        const pcm = await fetchAudio(text, params);
        await playBuffer(pcm);
      },

      voices: function() {
        return voiceList.map(v => ({ id: v.id, label: v.label, lang: v.lang }));
      },

      pause: function() {
        if (!audioCtx || !currentSource) return;
        pausedAt = audioCtx.currentTime - startedAt;
        currentSource.stop();
        currentSource = null;
        paused = true;
      },

      resume: function() {
        if (!paused || !pausedBuffer) return;
        const ctx = getAudioCtx();
        currentSource = ctx.createBufferSource();
        currentSource.buffer = pausedBuffer;
        currentSource.connect(ctx.destination);
        startedAt = ctx.currentTime - pausedAt;
        currentSource.start(0, pausedAt);
        currentSource.onended = () => { currentSource = null; };
        paused = false;
        if (resumeResolve) { resumeResolve(); resumeResolve = null; }
      },

      stop: function() {
        if (currentSource) { try { currentSource.stop(); } catch(e) {} currentSource = null; }
        paused = false;
        pausedBuffer = null;
        pausedAt = 0;
        if (resumeResolve) { resumeResolve(); resumeResolve = null; }
      }
    });
  })();

})();
