import React, { useState, useEffect } from 'react';
import styles from './TTS.module.css';
import { ICONS } from '../../utils/icons';

// The voice, shared by two views of it: the transport in the reader (play,
// pause, stop, and what it is doing) and the choices in the settings panel's
// Listening group (engine, voice, speed). Both read and write window.TTS, so
// a voice chosen in the panel is the one the reader plays.
function useTTS() {
  const [T, setT] = useState(null);
  const [state, setState] = useState('stopped'); // 'playing', 'paused', 'loading', 'stopped'
  const [engines, setEngines] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [capabilities, setCapabilities] = useState({});
  const [params, setParams] = useState({});
  const [engineProgress, setEngineProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Wait for the window.TTS global to be populated (e.g. from injected tts.js)
    if (!window.TTS) return;
    const tts = window.TTS;
    setT(tts);

    const updateState = (s) => {
      setState(s);
      if (s !== 'loading') setEngineProgress(0); // Reset progress when leaving loading
      if (s === 'playing' || s === 'stopped') {
        if (!isError) setStatusMessage(null);
      }
    };
    
    const handleEngineProgress = (p) => setEngineProgress(p * 100);
    const handleLoadingProgress = ({ engine, progress }) => {
      if (progress && progress.status === 'progress' && progress.progress !== undefined) {
        const pct = Math.round(progress.progress * 100);
        setStatusMessage(`Loading ${engine}: ${pct}%`);
      } else if (progress && progress.status) {
        setStatusMessage(`Loading ${engine}...`);
      }
    };

    const handleError = (e) => {
      const err = e && (e.error || e.message || String(e));
      const engine = e && e.engine;
      setErrorMsg(err || 'TTS error');
      setIsError(true);
      setStatusMessage(`${engine || 'TTS'} error: ${err || 'Playback failed'}`);
      setTimeout(() => {
        setErrorMsg('');
        setStatusMessage(null);
        setIsError(false);
      }, 5000);
    };

    const refreshEngines = () => {
      setEngines(tts.engines());
      setSelectedEngine(tts.selected());
    };

    const refreshCapabilities = () => {
      const vList = tts.voices();
      setVoices(vList);
      const caps = tts.capabilities();
      setCapabilities(caps);
      // Initialize local params state from engine current values
      const newParams = {};
      for (const key of Object.keys(caps)) {
        if (key === 'voice') {
          // Keep the reader's choice if it is still on offer; otherwise the
          // first of the curated voices.
          let chosen = tts.get('voice');
          if (!chosen || (vList.length && !vList.some(v => v.id === chosen))) {
            chosen = caps.voice.default || (vList[0] && vList[0].id);
          }
          if (chosen) {
            tts.set('voice', chosen);
            setSelectedVoice(chosen);
          }
        } else {
          newParams[key] = tts.get(key) !== undefined ? tts.get(key) : caps[key].default;
        }
      }
      setParams(newParams);
    };

    tts.on('state', updateState);
    tts.on('capabilitiesChanged', refreshCapabilities);
    tts.on('engineProgress', handleEngineProgress);
    tts.on('loadingProgress', handleLoadingProgress);
    tts.on('error', handleError);

    refreshEngines();
    refreshCapabilities();

    // Specific to browser engine
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', refreshCapabilities);
    }

    return () => {
      if (tts.off) {
        tts.off('state', updateState);
        tts.off('capabilitiesChanged', refreshCapabilities);
        tts.off('engineProgress', handleEngineProgress);
        tts.off('loadingProgress', handleLoadingProgress);
        tts.off('error', handleError);
      }
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
    setStatusMessage(null);
    setIsError(false);
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

  return {
    T, state, engines, selectedEngine, voices, selectedVoice, capabilities, params, engineProgress,
    errorMsg, statusMessage, isError, setStatusMessage, setIsError,
    handleEngineChange, handleVoiceChange, handleParamChange,
  };
}

// The transport, in the reader's toolbar.
export function TTS({ targetRef }) {
  const { T, state, engineProgress, errorMsg, statusMessage, isError, setStatusMessage, setIsError } = useTTS();

  const handlePlay = () => {
    if (!T || !targetRef.current) return;
    setStatusMessage(null);
    setIsError(false);
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

  return (
    <div className={styles.ttsGroup} style={{ position: 'relative' }}>
      {state !== 'playing' && (
        <button className={styles.tb} onClick={handlePlay} title="Play" dangerouslySetInnerHTML={{ __html: `${ICONS.play}<span class="${styles.tbTooltip}">Play</span>` }} />
      )}
      {state === 'playing' && (
        <button className={styles.tb} onClick={handlePause} title="Pause" dangerouslySetInnerHTML={{ __html: `${ICONS.pause}<span class="${styles.tbTooltip}">Pause</span>` }} />
      )}
      {(state === 'playing' || state === 'paused' || state === 'loading') && (
        <button className={styles.tb} onClick={handleStop} title="Stop" dangerouslySetInnerHTML={{ __html: `${ICONS.stop}<span class="${styles.tbTooltip}">Stop</span>` }} />
      )}

      {state === 'loading' && engineProgress > 0 && (
        <div className={styles.loadingBarContainer}>
          <div className={styles.loadingBarFill} style={{ width: `${engineProgress}%` }} />
        </div>
      )}

      {state === 'playing' && (
        <div className={styles.visualizer}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      )}

      <div className={`${styles.errorToast} ${errorMsg ? styles.show : ''}`}>
        {errorMsg}
      </div>

      {statusMessage && (
        <span className={`${styles.statusBadge} ${isError ? styles.error : ''}`}>
          {statusMessage}
        </span>
      )}
    </div>
  );
}

// The choices, in the settings panel's Listening group.
export function TTSSettings() {
  const {
    T, engines, selectedEngine, voices, selectedVoice, capabilities, params,
    handleEngineChange, handleVoiceChange, handleParamChange,
  } = useTTS();
  if (!T) return null;

  // The engine already curates the list: a handful of voices, best first.
  const renderVoiceOptions = () => {
    if (!voices.length) return <option>Loading...</option>;
    return voices.map(v => <option key={v.id} value={v.id}>{v.label}</option>);
  };

  return (
    <div className={styles.ttsSettings} data-tts-settings>
      {engines.length > 1 && (
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
      )}

      <label className={styles.settingRow}>
        <span>Voice</span>
        <select
          className={styles.select}
          value={selectedVoice}
          onChange={handleVoiceChange}
          data-tts-voice
        >
          {renderVoiceOptions()}
        </select>
      </label>

      <div className={styles.params}>
        {Object.entries(capabilities).map(([key, spec]) => {
          // Voice and speed. Pitch and volume would only repeat what the
          // device already does well.
          if (!spec || key === 'voice' || key === 'pitch' || key === 'volume') return null;

          if (spec.type === 'range') {
            return (
              <label key={key} className={styles.settingRow} title={`${spec.label}: ${params[key]}`}>
                <span>{spec.label} <span className={styles.paramValue}>{Number(params[key] ?? spec.default).toFixed(1)}×</span></span>
                <input
                  data-tts-param={key}
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
              <label key={key} className={styles.settingRow}>
                <span>{spec.label}</span>
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
