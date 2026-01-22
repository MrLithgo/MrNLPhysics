/* app.js
   Speed of Sound (Phase Alignment) – 2-trace oscilloscope simulation
   CH1: speaker drive (reference)
   CH2: microphone signal (phase-shifted by distance)

   This version:
   - Both traces red (coral)
   - Global timebase
   - Independent vertical scale (V/div) per channel
   - Independent Y offset controls per channel
   - Trigger locks to CH1 (rising crossing of CH1 midline, including CH1 offset)
*/

(() => {
  // -----------------------------
  // DOM
  // -----------------------------
  const canvas = document.getElementById("simCanvas");
  const ctx = canvas.getContext("2d");

  const els = {
    // Right panel controls
    distance: document.getElementById("distance"),
    distanceValue: document.getElementById("distanceValue"),
    dMinus: document.getElementById("dMinus"),
    dPlus: document.getElementById("dPlus"),

    freq: document.getElementById("freq"),
    freqValue: document.getElementById("freqValue"),

    temp: document.getElementById("temp"),
    tempValue: document.getElementById("tempValue"),

    noise: document.getElementById("noise"),
    noiseValue: document.getElementById("noiseValue"),

    resetBtnTop: document.getElementById("resetBtnTop"),
    resetBtn: document.getElementById("resetBtn"),

    // Under-screen scope controls
    timeDiv: document.getElementById("timeDiv"),

    voltDivCh1: document.getElementById("voltDivCh1"),
    voltDivCh2: document.getElementById("voltDivCh2"),

    ch1Up: document.getElementById("ch1Up"),
    ch1Down: document.getElementById("ch1Down"),
    ch2Up: document.getElementById("ch2Up"),
    ch2Down: document.getElementById("ch2Down"),
    offsetsZero: document.getElementById("offsetsZero"),
    ch1OffsetValue: document.getElementById("ch1OffsetValue"),
    ch2OffsetValue: document.getElementById("ch2OffsetValue"),

    // Overlay readouts
    readF: document.getElementById("readF"),
    readD: document.getElementById("readD"),
    readTimeDiv: document.getElementById("readTimeDiv"),
    readVoltDiv: document.getElementById("readVoltDiv"),

    statusBadge: document.getElementById("statusBadge"),
    
    
  };

  const presetBtns = Array.from(document.querySelectorAll("[data-f]"));

  // -----------------------------
  // State
  // -----------------------------
  const state = {
    d: parseFloat(els.distance?.value ?? "0.50"),
    f: parseFloat(els.freq?.value ?? "1000"),
    tempC: parseFloat(els.temp?.value ?? "20"),
    noise: parseFloat(els.noise?.value ?? "0.05"),

    timeDiv_ms: parseFloat(els.timeDiv?.value ?? "0.20"),

    // Independent V/div per channel
    voltDiv1: parseFloat(els.voltDivCh1?.value ?? "1.0"),
    voltDiv2: parseFloat(els.voltDivCh2?.value ?? "1.0"),

    // Independent Y offsets (in volts)
    yOff1: 0.0,
    yOff2: 0.0,

    // Wave amplitudes
    ampRef: 1.0,
    ampMic: 0.9,

    // Rendering
    dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
    
    
  };

  // -----------------------------
  // Helpers
  // -----------------------------
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function speedOfSoundFromTempC(T) {
    return 331 + 0.6 * T;
  }

  function resizeCanvasToCSS() {
    const r = canvas.getBoundingClientRect();
    const dpr = state.dpr;
    const w = Math.max(300, Math.floor(r.width * dpr));
    const h = Math.max(200, Math.floor(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  function setText(el, text) {
    if (el) el.textContent = String(text);
  }

  function formatFixed(x, dp) {
    const n = Number(x);
    if (!Number.isFinite(n)) return "—";
    return n.toFixed(dp);
  }

  function updateReadouts() {
    setText(els.distanceValue, formatFixed(state.d, 2));
    setText(els.freqValue, Math.round(state.f));

    setText(els.tempValue, Math.round(state.tempC));
    setText(els.noiseValue, formatFixed(state.noise, 3));

    setText(els.readF, Math.round(state.f));
    setText(els.readD, formatFixed(state.d, 2));
    setText(els.readTimeDiv, formatFixed(state.timeDiv_ms, 2));

    // Show both channel scales in the single overlay badge
    // (keeps your overlay layout unchanged)
    setText(els.readVoltDiv, `${formatFixed(state.voltDiv1, 1)}/${formatFixed(state.voltDiv2, 1)}`);

    setText(els.ch1OffsetValue, formatFixed(state.yOff1, 2));
    setText(els.ch2OffsetValue, formatFixed(state.yOff2, 2));
  }

  // Gaussian-ish noise using sum of uniforms
  function approxGaussian() {
    let s = 0;
    for (let i = 0; i < 6; i++) s += Math.random();
    return (s / 6) * 2 - 1;
  }

  // Find first rising crossing of "level": y[i-1] <= level and y[i] > level
  function findTriggerIndex(samples, level) {
    for (let i = 1; i < samples.length; i++) {
      if (samples[i - 1] <= level && samples[i] > level) return i;
    }
    return 0;
  }

  // -----------------------------
  // Scope mapping
  // -----------------------------
  function scopeParams() {
    const w = canvas.width;
    const h = canvas.height;

    // Grid divisions
    const divX = 10;
    const divY = 8;

    const pad = Math.round(10 * state.dpr);
    const plot = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };

    const pxPerDivX = plot.w / divX;
    const pxPerDivY = plot.h / divY;

    const timeDiv_s = state.timeDiv_ms / 1000;
    const totalTime_s = timeDiv_s * divX;

    return { w, h, divX, divY, plot, pxPerDivX, pxPerDivY, timeDiv_s, totalTime_s };
  }

  function timeToX(t, sp) {
    return sp.plot.x + (t / sp.totalTime_s) * sp.plot.w;
  }

function makeVoltMapper(sp, voltDiv) {
  // Ensure voltDiv is valid and not too small
  const safeVoltDiv = Math.max(0.001, voltDiv);
  
  // Calculate total volts displayed
  const voltsFullScale = safeVoltDiv * sp.divY; // 8 divisions total
  const vPerPixel = voltsFullScale / sp.plot.h;
  
  // Avoid division by zero
  if (Math.abs(vPerPixel) < 1e-10) {
    return (v) => sp.plot.y + sp.plot.h / 2;
  }
  
  return (v) => {
    const mid = sp.plot.y + sp.plot.h / 2;
    const pixels = v / vPerPixel;
    return mid - pixels;
  };
}

  // -----------------------------
  // Signal generation
  // -----------------------------
  function makeWaveSamples({ f, amp, phaseRad, dc, noise, sampleCount, dt }) {
    const out = new Float32Array(sampleCount);
    const omega = 2 * Math.PI * f;

    for (let i = 0; i < sampleCount; i++) {
      const t = i * dt;
      let y = dc + amp * Math.sin(omega * t + phaseRad);
      if (noise > 0) y += noise * approxGaussian();
      out[i] = y;
    }
    return out;
  }

  function micAmplitudeFromDistance(d) {
    const a = 1 / Math.sqrt(Math.max(0.05, d));
    return clamp(0.95 * a, 0.25, 1.1);
  }

  // -----------------------------
  // Drawing
  // -----------------------------
  function drawGrid(sp) {
    const { plot, divX, divY, pxPerDivX, pxPerDivY } = sp;

    ctx.clearRect(0, 0, sp.w, sp.h);

    ctx.save();
    ctx.lineWidth = 1 * state.dpr;

    // Subtle grid
    ctx.strokeStyle = "rgba(44, 62, 80, 0.16)";
    for (let i = 0; i <= divX; i++) {
      const x = plot.x + i * pxPerDivX;
      ctx.beginPath();
      ctx.moveTo(x, plot.y);
      ctx.lineTo(x, plot.y + plot.h);
      ctx.stroke();
    }
    for (let j = 0; j <= divY; j++) {
      const y = plot.y + j * pxPerDivY;
      ctx.beginPath();
      ctx.moveTo(plot.x, y);
      ctx.lineTo(plot.x + plot.w, y);
      ctx.stroke();
    }

    // Central axes slightly stronger
    ctx.strokeStyle = "rgba(44, 62, 80, 0.24)";
    ctx.lineWidth = 1.25 * state.dpr;

    ctx.beginPath();
    ctx.moveTo(plot.x, plot.y + plot.h / 2);
    ctx.lineTo(plot.x + plot.w, plot.y + plot.h / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(plot.x + plot.w / 2, plot.y);
    ctx.lineTo(plot.x + plot.w / 2, plot.y + plot.h);
    ctx.stroke();

    ctx.restore();
  }

  function drawTrace(samples, sp, yMapFn, color, triggerIndex) {
    const N = samples.length;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * state.dpr;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const idx = (triggerIndex + i) % N;
      const t = (i / (N - 1)) * sp.totalTime_s;
      const x = timeToX(t, sp);
      const y = yMapFn(samples[idx]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // -----------------------------
  // Render loop
  // -----------------------------
  function render() {
    resizeCanvasToCSS();
    const sp = scopeParams();

    // Smooth sampling: bounded for performance
    const targetFs = clamp(state.f * 80, 20000, 200000);
    const totalTime = sp.totalTime_s;

    let sampleCount = Math.floor(targetFs * totalTime);
    sampleCount = clamp(sampleCount, 1200, 6000);
    const dt = totalTime / sampleCount;

    // Phase shift from propagation delay
    const c = speedOfSoundFromTempC(state.tempC);
    const delay = state.d / c;
    const phi = 2 * Math.PI * state.f * delay;

    const ampMic = state.ampMic * micAmplitudeFromDistance(state.d);

    // Apply Y offsets as DC offsets (in volts)
    const ch1 = makeWaveSamples({
      f: state.f,
      amp: state.ampRef,
      phaseRad: 0,
      dc: state.yOff1,
      noise: 0,
      sampleCount,
      dt,
    });

    const ch2 = makeWaveSamples({
      f: state.f,
      amp: ampMic,
      phaseRad: -phi,
      dc: state.yOff2,
      noise: state.noise,
      sampleCount,
      dt,
    });

    // Trigger on CH1 crossing its own midline (offset included)
    const trig = findTriggerIndex(ch1, state.yOff1);

    // Channel-specific vertical mappings
    const yMap1 = makeVoltMapper(sp, state.voltDiv1);
    const yMap2 = makeVoltMapper(sp, state.voltDiv2);

    drawGrid(sp);

    // Both traces coral; slightly different alpha so overlap is readable
    drawTrace(ch1, sp, yMap1, "rgba(231, 76, 60, 0.95)", trig);
    drawTrace(ch2, sp, yMap2, "rgba(231, 76, 60, 0.65)", trig);

    updateReadouts();

    if (els.statusBadge) {
      els.statusBadge.textContent = "RUN";
      els.statusBadge.classList.add("ready");
    }

    requestAnimationFrame(render);
  }

  // -----------------------------
  // Control wiring
  // -----------------------------
  function setDistance(val) {
    state.d = clamp(val, 0.05, 2.0);
    if (els.distance) els.distance.value = String(state.d);
  }

  function setFrequency(val) {
    state.f = clamp(val, 100, 8000);
    if (els.freq) els.freq.value = String(Math.round(state.f));
  }

  function readNumber(el, fallback) {
  if (!el) return fallback;
  const n = Number(el.value);
  return Number.isFinite(n) ? n : fallback;
}

function syncFromControls() {
  state.d = readNumber(els.distance, state.d);
  state.f = readNumber(els.freq, state.f);
  state.timeDiv_ms = readNumber(els.timeDiv, state.timeDiv_ms);
  state.tempC = readNumber(els.temp, state.tempC);
  state.noise = readNumber(els.noise, state.noise);

  // Get values directly from dropdowns
  if (els.voltDivCh1) {
    state.voltDiv1 = parseFloat(els.voltDivCh1.value);
  }
  if (els.voltDivCh2) {
    state.voltDiv2 = parseFloat(els.voltDivCh2.value);
  }

  // Clamp to sensible minimums
  state.voltDiv1 = Math.max(0.001, state.voltDiv1);
  state.voltDiv2 = Math.max(0.001, state.voltDiv2);

  // Clamp offsets to within +/-3 divisions per channel
  state.yOff1 = clamp(state.yOff1, -3 * state.voltDiv1, 3 * state.voltDiv1);
  state.yOff2 = clamp(state.yOff2, -3 * state.voltDiv2, 3 * state.voltDiv2);

  updateReadouts();
}


  function resetAll() {
    state.d = 0.5;
    state.f = 1000;
    state.timeDiv_ms = 0.20;
    state.voltDiv1 = 1.0;
    state.voltDiv2 = 1.0;
    state.tempC = 20;
    state.noise = 0.05;
    state.yOff1 = 0.0;
    state.yOff2 = 0.0;

    if (els.distance) els.distance.value = "0.50";        // "0.50" not String(0.5)
  if (els.freq) els.freq.value = "1000";               // "1000" not String(1000)
  if (els.timeDiv) els.timeDiv.value = "0.20";         // "0.20" not String(0.20) -> "0.2"
  if (els.voltDivCh1) els.voltDivCh1.value = "1";      // "1" not String(1.0) -> "1"
  if (els.voltDivCh2) els.voltDivCh2.value = "1";      // "1" not String(1.0) -> "1"
  if (els.temp) els.temp.value = "20";                 // "20" not String(20)
  if (els.noise) els.noise.value = "0.05";   

    updateReadouts();
  }

  function offsetStepV(channel) {
    // 0.2 divisions per click, per-channel scale
    const div = channel === 1 ? state.voltDiv1 : state.voltDiv2;
    return 0.2 * div;
  }

  function bumpOffset(channel, dir) {
    const step = offsetStepV(channel);
    const delta = dir * step;

    if (channel === 1) {
      const max = 3.0 * state.voltDiv1;
      state.yOff1 = clamp(state.yOff1 + delta, -max, max);
    } else {
      const max = 3.0 * state.voltDiv2;
      state.yOff2 = clamp(state.yOff2 + delta, -max, max);
    }
    updateReadouts();
  }

  // Distance
  els.distance?.addEventListener("input", () => {
    state.d = parseFloat(els.distance.value);
    updateReadouts();
  });
  els.dMinus?.addEventListener("click", () => { setDistance(state.d - 0.001); updateReadouts(); });
  els.dPlus?.addEventListener("click", () => { setDistance(state.d + 0.001); updateReadouts(); });

  // Frequency + presets
  els.freq?.addEventListener("input", () => {
    state.f = parseFloat(els.freq.value);
    updateReadouts();
  });
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = parseFloat(btn.getAttribute("data-f") || "1000");
      setFrequency(f);
      updateReadouts();
    });
  });

  // Timebase
  els.timeDiv?.addEventListener("change", syncFromControls);

  // Channel V/div
  
  
  // Add these to your event listener setup
els.voltDivCh1?.addEventListener('change', function() {
  state.voltDiv1 = parseFloat(this.value);
  updateReadouts();
});

els.voltDivCh2?.addEventListener('change', function() {
  state.voltDiv2 = parseFloat(this.value);
  updateReadouts();
});

  // Realism
  els.temp?.addEventListener("input", () => { state.tempC = parseFloat(els.temp.value); updateReadouts(); });
  els.noise?.addEventListener("input", () => { state.noise = parseFloat(els.noise.value); updateReadouts(); });

  // Offsets
  els.ch1Up?.addEventListener("click", () => bumpOffset(1, +1));
  els.ch1Down?.addEventListener("click", () => bumpOffset(1, -1));
  els.ch2Up?.addEventListener("click", () => bumpOffset(2, +1));
  els.ch2Down?.addEventListener("click", () => bumpOffset(2, -1));
  els.offsetsZero?.addEventListener("click", () => {
    state.yOff1 = 0.0;
    state.yOff2 = 0.0;
    updateReadouts();
  });

  // Reset (support either id if present)
  els.resetBtnTop?.addEventListener("click", resetAll);
  els.resetBtn?.addEventListener("click", resetAll);

  // Init
  resetAll();
  updateReadouts();
  requestAnimationFrame(render);
})();


