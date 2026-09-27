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
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NAV') return NodeFilter.FILTER_REJECT;
        if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent;
      const parts = text.match(/[^.!?]*[.!?]+[\s]*/g);
      if (parts) {
        let offset = 0;
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.length > 0) {
            result.push({ text: trimmed, node: node, offset: offset, length: part.length });
          }
          offset += part.length;
        }
        const consumed = parts.join('').length;
        if (consumed < text.length) {
          const remainder = text.slice(consumed).trim();
          if (remainder.length > 0) {
            result.push({ text: remainder, node: node, offset: consumed, length: text.length - consumed });
          }
        }
      } else {
        const trimmed = text.trim();
        if (trimmed.length > 0) {
          result.push({ text: trimmed, node: node, offset: 0, length: text.length });
        }
      }
    }
    return result;
  }

  // ── Highlighting & scroll sync ─────────────────────────────────────────────
  let highlightMark = null;

  function highlightSentence(idx) {
    clearHighlight();
    if (idx < 0 || idx >= sentences.length) return;
    const s = sentences[idx];
    if (!s.node.parentElement) return;
    try {
      const range = document.createRange();
      range.setStart(s.node, s.offset);
      range.setEnd(s.node, Math.min(s.offset + s.length, s.node.textContent.length));
      highlightMark = document.createElement('mark');
      highlightMark.className = 'tts-active';
      range.surroundContents(highlightMark);
    } catch (e) { return; }

    if (scrollContainer && highlightMark) {
      const cr = scrollContainer.getBoundingClientRect();
      const mr = highlightMark.getBoundingClientRect();
      const rel = mr.top - cr.top;
      scrollContainer.scrollTo({ top: scrollContainer.scrollTop + rel - cr.height * 0.33, behavior: 'smooth' });
    }
  }

  function clearHighlight() {
    if (highlightMark && highlightMark.parentNode) {
      const parent = highlightMark.parentNode;
      while (highlightMark.firstChild) parent.insertBefore(highlightMark.firstChild, highlightMark);
      parent.removeChild(highlightMark);
      parent.normalize();
    }
    highlightMark = null;
  }

  // ── Playback loop ──────────────────────────────────────────────────────────
  async function speakNext() {
    if (!playing || sentenceIndex >= sentences.length) {
      stopAll();
      return;
    }
    highlightSentence(sentenceIndex);
    emit('progress', { index: sentenceIndex, total: sentences.length });

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
  window.TTS = {
    register: function (engine) {
      registry[engine.id] = engine;
      // Auto-select first registered engine
      if (!activeId) {
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
      return Object.values(registry).map(e => ({
        id: e.id,
        label: e.label,
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

    const CURATED = new Set([
      'Samantha', 'Daniel', 'Karen', 'Moira', 'Tessa', 'Rishi', 'Tara', 'Aman',
      'Flo', 'Shelley', 'Sandy', 'Reed',
      'Google US English', 'Google UK English Male', 'Google UK English Female',
    ]);

    window.TTS.register({
      id: 'browser',
      label: 'Browser (Device)',
      capabilities: {
        speed:  { type: 'range', min: 0.5, max: 3, step: 0.1, default: 1, label: 'Speed' },
        pitch:  { type: 'range', min: 0, max: 2, step: 0.1, default: 1, label: 'Pitch' },
        volume: { type: 'range', min: 0, max: 1, step: 0.1, default: 1, label: 'Volume' },
        voice:  { type: 'voice', default: null, label: 'Voice' },
      },

      init: async function () {
        // Browser TTS is always ready — no model to load
        refreshVoices();
      },

      voices: function () {
        const all = synth.getVoices();
        // Group by language, curated first
        return all.map(v => {
          const clean = v.name.replace(/ \(English.*\)/, '');
          return {
            id: v.name,
            label: clean,
            lang: v.lang,
            curated: CURATED.has(clean),
          };
        }).sort((a, b) => {
          if (a.curated && !b.curated) return -1;
          if (!a.curated && b.curated) return 1;
          return a.label.localeCompare(b.label);
        });
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

  // ─── Built-in engine: Kokoro ───────────────────────────────────────────────
  // 82MB model, 53 voices, 9 languages. Loads on first play via Web Worker.

  (function registerKokoro() {
    let worker = null;
    let ready = false;
    let voiceList = [];       // raw voice IDs from model
    let voiceMeta = {};       // { id: { name, language, gender, overallGrade } }
    let currentAudio = null;
    let resolveSpeak = null;

    const LANG_MAP = {
      a: 'en-US', b: 'en-GB', e: 'es', f: 'fr', h: 'hi', i: 'it', j: 'ja', p: 'pt', z: 'zh'
    };

    window.TTS.register({
      id: 'kokoro',
      label: 'Kokoro (82M)',
      capabilities: {
        speed:   { type: 'range', min: 0.5, max: 2, step: 0.1, default: 1, label: 'Speed' },
        quality: { type: 'select', options: [
          { value: 'fp32', label: 'High (fp32)' },
          { value: 'q8', label: 'Balanced (q8)' },
          { value: 'q4', label: 'Fast (q4)' },
        ], default: 'q8', label: 'Quality' },
        voice:   { type: 'voice', default: null, label: 'Voice' },
      },

      init: async function (p) {
        if (ready) return;
        const workerUrl = (window.TTS_CONFIG && window.TTS_CONFIG.kokoroWorkerUrl) || './kokoro-worker.js';
        worker = new Worker(workerUrl, { type: 'module' });
        return new Promise((resolve, reject) => {
          worker.addEventListener('message', function handler(e) {
            const msg = e.data;
            if (msg.status === 'ready') {
              ready = true;
              voiceList = msg.voices || [];
              // Parse voice metadata if provided
              if (msg.voiceMeta) voiceMeta = msg.voiceMeta;
              worker.removeEventListener('message', handler);
              resolve();
            }
            if (msg.status === 'error') {
              worker.removeEventListener('message', handler);
              reject(new Error(msg.error));
            }
          });
          // Worker auto-inits on creation — it loads the model immediately
        });
      },

      voices: function () {
        return voiceList.map(id => {
          const prefix = id.charAt(0);
          const gender = id.charAt(1) === 'f' ? 'female' : 'male';
          const lang = LANG_MAP[prefix] || 'en';
          const meta = voiceMeta[id] || {};
          return {
            id: id,
            label: meta.name || id,
            lang: lang,
            gender: gender,
            grade: meta.overallGrade || '',
          };
        }).sort((a, b) => a.lang.localeCompare(b.lang) || a.label.localeCompare(b.label));
      },

      speak: function (text, p) {
        return new Promise((resolve, reject) => {
          resolveSpeak = resolve;

          const onMsg = function (e) {
            const msg = e.data;
            if (msg.status === 'complete') {
              worker.removeEventListener('message', onMsg);
              // Play the audio blob
              if (currentAudio) { currentAudio.pause(); currentAudio = null; }
              currentAudio = new Audio(msg.audio);
              currentAudio.onended = () => { currentAudio = null; resolve(); };
              currentAudio.onerror = (e) => { currentAudio = null; reject(e); };
              currentAudio.play();
            }
            if (msg.status === 'error') {
              worker.removeEventListener('message', onMsg);
              reject(new Error(msg.error));
            }
          };
          worker.addEventListener('message', onMsg);

          worker.postMessage({
            action: 'generate',
            text: text,
            voice: p.voice || 'af_heart',
            speed: p.speed || 1,
          });
        });
      },

      pause: function () { if (currentAudio) currentAudio.pause(); },
      resume: function () { if (currentAudio) currentAudio.play(); },
      stop: function () {
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
        if (resolveSpeak) { resolveSpeak(); resolveSpeak = null; }
      },
    });
  })();

  // ─── Built-in engine: Supertonic ───────────────────────────────────────────
  // 66M model, 10 voices, 5 languages. Official ONNX Runtime Web support.
  // Lazy-loads from worker on first play.

  (function registerSupertonic() {
    // Supertonic requires a separate worker and model files.
    // This is a registration stub — the actual worker (supertonic-worker.js)
    // must be served alongside the page. If not present, engine stays unavailable.

    let worker = null;
    let ready = false;
    let currentAudio = null;
    let resolveSpeak = null;

    const VOICES = [
      { id: 'F1', label: 'Female 1', gender: 'female' },
      { id: 'F2', label: 'Female 2', gender: 'female' },
      { id: 'F3', label: 'Female 3', gender: 'female' },
      { id: 'F4', label: 'Female 4', gender: 'female' },
      { id: 'F5', label: 'Female 5', gender: 'female' },
      { id: 'M1', label: 'Male 1', gender: 'male' },
      { id: 'M2', label: 'Male 2', gender: 'male' },
      { id: 'M3', label: 'Male 3', gender: 'male' },
      { id: 'M4', label: 'Male 4', gender: 'male' },
      { id: 'M5', label: 'Male 5', gender: 'male' },
    ];

    const LANGUAGES = [
      { value: 'en', label: 'English' },
      { value: 'ko', label: 'Korean' },
      { value: 'es', label: 'Spanish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'fr', label: 'French' },
    ];

    window.TTS.register({
      id: 'supertonic',
      label: 'Supertonic (66M)',
      capabilities: {
        speed:    { type: 'range', min: 0.5, max: 2, step: 0.05, default: 1.05, label: 'Speed' },
        quality:  { type: 'range', min: 1, max: 20, step: 1, default: 5, label: 'Quality (steps)' },
        language: { type: 'select', options: LANGUAGES, default: 'en', label: 'Language' },
        voice:    { type: 'voice', default: null, label: 'Voice' },
      },

      init: async function (p) {
        if (ready) return;
        const workerUrl = (window.TTS_CONFIG && window.TTS_CONFIG.supertonicWorkerUrl) || './supertonic-worker.js';
        worker = new Worker(workerUrl);
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Supertonic worker load timeout')), 60000);
          worker.addEventListener('message', function handler(e) {
            const msg = e.data;
            if (msg.status === 'ready') {
              ready = true;
              clearTimeout(timeout);
              worker.removeEventListener('message', handler);
              resolve();
            }
            if (msg.status === 'error') {
              clearTimeout(timeout);
              worker.removeEventListener('message', handler);
              reject(new Error(msg.error));
            }
          });
        });
      },

      voices: function () {
        return VOICES.map(v => ({ id: v.id, label: v.label, gender: v.gender, lang: 'multi' }));
      },

      speak: function (text, p) {
        return new Promise((resolve, reject) => {
          resolveSpeak = resolve;
          const onMsg = function (e) {
            const msg = e.data;
            if (msg.status === 'complete') {
              worker.removeEventListener('message', onMsg);
              // msg.wav is a Float32Array, msg.sampleRate is the rate
              const wavBlob = pcmToWavBlob(msg.wav, msg.sampleRate);
              if (currentAudio) { currentAudio.pause(); currentAudio = null; }
              currentAudio = new Audio(URL.createObjectURL(wavBlob));
              currentAudio.onended = () => { currentAudio = null; resolve(); };
              currentAudio.onerror = (e) => { currentAudio = null; reject(e); };
              currentAudio.play();
            }
            if (msg.status === 'error') {
              worker.removeEventListener('message', onMsg);
              reject(new Error(msg.error));
            }
          };
          worker.addEventListener('message', onMsg);

          worker.postMessage({
            action: 'generate',
            text: text,
            voice: p.voice || 'F1',
            language: p.language || 'en',
            speed: p.speed || 1.05,
            totalStep: p.quality || 5,
          });
        });
      },

      pause: function () { if (currentAudio) currentAudio.pause(); },
      resume: function () { if (currentAudio) currentAudio.play(); },
      stop: function () {
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
        if (resolveSpeak) { resolveSpeak(); resolveSpeak = null; }
      },
    });

    // PCM float array → WAV blob
    function pcmToWavBlob(pcm, sampleRate) {
      const length = pcm.length;
      const buffer = new ArrayBuffer(44 + length * 2);
      const view = new DataView(buffer);
      // RIFF header
      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + length * 2, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, length * 2, true);
      for (let i = 0; i < length; i++) {
        const s = Math.max(-1, Math.min(1, pcm[i]));
        view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
      return new Blob([buffer], { type: 'audio/wav' });
    }
    function writeString(view, offset, str) {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
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
