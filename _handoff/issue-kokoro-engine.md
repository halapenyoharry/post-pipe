Kokoro has never produced audio for a reader.

**wasm mode** (the default in settings.json): the browser-side path has always hung on "loading". The settings note records that `kokoro-worker.js` and the ONNX runtime were never actually built. The 2026-09-26 merge brought in a fuller `kokoro-worker.js` (kokoro-js, WebGPU with WASM fallback), but it is unverified in a browser.

**server mode**: calls the self-hosted Kokoro on lumen (`http://192.168.1.3:8880`, OpenAI-compatible `/v1/audio/speech`). It is only reachable from the home network, so any public reader gets a fetch failure.

Kokoro is still `exposed: true` by default, so readers are offered an engine that fails.

Decide: fix it (verify the wasm worker end to end, or provide a publicly reachable server) or remove Kokoro from the engine. Until then, sites should set `tts.engines.kokoro.exposed: false`.
