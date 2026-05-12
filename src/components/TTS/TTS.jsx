import React, { useState, useEffect } from 'react';
import styles from './TTS.module.css';
import { ICONS } from '../../utils/icons';

export function TTS({ targetRef }) {
  const [T, setT] = useState(null);
  const [state, setState] = useState('stopped'); // 'playing', 'paused', 'loading', 'stopped'
  const [engines, setEngines] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [capabilities, setCapabilities] = useState({});
  const [params, setParams] = useState({});

  useEffect(() => {
    // Wait for the window.TTS global to be populated (e.g. from injected tts.js)
    if (!window.TTS) return;
    const tts = window.TTS;
    setT(tts);

    const updateState = (s) => setState(s);

    const refreshEngines = () => {
      setEngines(tts.engines());
      setSelectedEngine(tts.selected());
    };

    const refreshCapabilities = () => {
      setVoices(tts.voices());
      setCapabilities(tts.capabilities());
      // Initialize local params state from engine current values
      const newParams = {};
      const caps = tts.capabilities();
      for (const key of Object.keys(caps)) {
        if (key === 'voice') {
          setSelectedVoice(tts.get('voice') || caps.voice.default);
        } else {
          newParams[key] = tts.get(key) !== undefined ? tts.get(key) : caps[key].default;
        }
      }
      setParams(newParams);
    };

    tts.on('state', updateState);
    tts.on('capabilitiesChanged', refreshCapabilities);

    refreshEngines();
    refreshCapabilities();

    // Specific to browser engine
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', refreshCapabilities);
    }

    return () => {
      // We do not have off() methods in current tts.js implementation so we are careful
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', refreshCapabilities);
      }
    };
  }, []);

  const handleEngineChange = (e) => {
    if (!T) return;
    const engineId = e.target.value;
    T.select(engineId);
    setSelectedEngine(engineId);
    setVoices(T.voices());
    setCapabilities(T.capabilities());
  };

  const handleVoiceChange = (e) => {
    if (!T) return;
    const voiceId = e.target.value;
    T.set('voice', voiceId);
    setSelectedVoice(voiceId);
  };

  const handleParamChange = (key, value) => {
    if (!T) return;
    T.set(key, value);
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handlePlay = () => {
    if (!T || !targetRef.current) return;
    T.play(targetRef.current, { scrollContainer: targetRef.current });
  };

  const handlePause = () => {
    if (!T) return;
    T.pause();
  };

  const handleStop = () => {
    if (!T) return;
    T.stop();
  };

  if (!T) return null; // Wait until global is mounted

  // Group voices by language
  const renderVoiceOptions = () => {
    if (!voices.length) return <option>Loading...</option>;

    const hasLang = voices.some(v => v.lang);
    if (hasLang) {
      const groups = {};
      voices.forEach(v => {
        const lang = v.lang || 'other';
        (groups[lang] = groups[lang] || []).push(v);
      });
      return Object.keys(groups).sort().map(lang => (
        <optgroup label={lang} key={lang}>
          {groups[lang].map(v => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </optgroup>
      ));
    }

    return voices.map(v => <option key={v.id} value={v.id}>{v.label}</option>);
  };

  return (
    <div className={styles.ttsGroup}>
      {state !== 'playing' && (
        <button className={styles.tb} onClick={handlePlay} title="Play" dangerouslySetInnerHTML={{ __html: `${ICONS.play}<span class="${styles.tbTooltip}">Play</span>` }} />
      )}
      {state === 'playing' && (
        <button className={styles.tb} onClick={handlePause} title="Pause" dangerouslySetInnerHTML={{ __html: `${ICONS.pause}<span class="${styles.tbTooltip}">Pause</span>` }} />
      )}
      {(state === 'playing' || state === 'paused' || state === 'loading') && (
        <button className={styles.tb} onClick={handleStop} title="Stop" dangerouslySetInnerHTML={{ __html: `${ICONS.stop}<span class="${styles.tbTooltip}">Stop</span>` }} />
      )}

      <select
        className={styles.select}
        style={{ maxWidth: 110 }}
        value={selectedEngine}
        onChange={handleEngineChange}
        title="TTS Engine"
      >
        {engines.map(e => (
          <option key={e.id} value={e.id}>{e.label}</option>
        ))}
      </select>

      <select
        className={styles.select}
        value={selectedVoice}
        onChange={handleVoiceChange}
        title="Voice"
      >
        {renderVoiceOptions()}
      </select>

      <div className={styles.params}>
        {Object.entries(capabilities).map(([key, spec]) => {
          if (!spec || key === 'voice') return null;

          if (spec.type === 'range') {
            return (
              <label key={key} title={`${spec.label}: ${params[key]}`}>
                {spec.label}
                <input
                  type="range"
                  min={spec.min}
                  max={spec.max}
                  step={spec.step || 0.1}
                  value={params[key] ?? spec.default}
                  onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                />
              </label>
            );
          } else if (spec.type === 'select') {
            return (
              <label key={key}>
                {spec.label}
                <select
                  value={params[key] ?? spec.default}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                >
                  {spec.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
