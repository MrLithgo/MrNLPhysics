/* script.js
   Ionising radiation investigation sim (canvas)
   Updates per your notes:
   - No drag toggle: users can ALWAYS drag the GM tube (when not counting) OR use the distance slider
   - GM tube drawn as a simple navy “cylinder” rectangle using a horizontal gradient
   - Wires extend from the RIGHT end of the GM tube
   - Absorber thickness changes the absorber's VISUAL width as well as the physics
   - No cps overlay (students infer rate from counts / time)
*/

(() => {
  // ---------- DOM ----------
  const els = {
    simArea: document.getElementById("simArea"),
    canvas: document.getElementById("stage"),

    sourceSelect: document.getElementById("sourceSelect"),
    distanceSlider: document.getElementById("distanceSlider"),
    distanceValue: document.getElementById("distanceValue"),

    absorberMaterial: document.getElementById("absorberMaterial"),
    thicknessSlider: document.getElementById("thicknessSlider"),
    thicknessValue: document.getElementById("thicknessValue"),
    thicknessUnit: document.getElementById("thicknessUnit"),

    sampleTime: document.getElementById("sampleTime"),
    startBtn: document.getElementById("startBtn"),
    resetBtn: document.getElementById("resetBtn"),

    resultsTable: document.getElementById("resultsTable"),
    clearResultsBtn: document.getElementById("clearResultsBtn"),
  };

  if (!els.canvas || !els.simArea) {
    console.warn("Missing #stage canvas or #simArea container.");
    return;
  }

  const ctx = els.canvas.getContext("2d");

  // ---------- Constants / Config ----------
  const COLORS = {
    navy: "#2c3e50",
    slate: "#556366",
    softgray: "#e9ecef",
    white: "#ffffff",
    teal: "#1abc9c",
    gold: "#f1c40f",
    coral: "#e74c3c",
    shadow: "rgba(0,0,0,0.08)",
  };

  const SOURCE_DEFS = {
    background: { label: "Background only", kind: "background" },
    am241: { label: "Am-241 (smoke detector)", kind: "alpha" },
    sr90: { label: "Sr-90 (beta source)", kind: "beta" },
    cs137: { label: "Cs-137 (gamma source)", kind: "gamma" },
    mystery: { label: "Mystery source", kind: "mystery" },
  };

  // “School practical feel” baselines
  const BASE_CPS = {
    background: 0.25,
    alpha: 12,
    beta: 18,
    gamma: 14,
  };

  const D0_CM = 10;
  const AIR_RANGE_CM_ALPHA = 7.0;

  const K_MM = {
    alpha: { none: 0.0, paper: 4.0, aluminium: 10.0, lead: 14.0 },
    beta:  { none: 0.0, paper: 0.35, aluminium: 0.85, lead: 1.8 },
    gamma: { none: 0.0, paper: 0.02, aluminium: 0.06, lead: 0.20 },
  };

  const THICKNESS_RANGES = {
    none:      { min: 0, max: 0, unit: "mm" },
    paper:     { min: 0, max: 8, unit: "mm" },
    aluminium: { min: 0, max: 12, unit: "mm" },
    lead:      { min: 0, max: 25, unit: "mm" },
  };

  // Absorber visual thickness mapping (mm -> px)
  const ABSORB_PX = {
    base: 4,   // minimum visible width when thickness > 0
    perMm: 3,  // each mm adds this many pixels
    max: 90,   // clamp width so it doesn't get silly
  };

  const MAX_PARTICLES = 220;

  // ---------- State ----------
  const state = {
    dpr: 1,
    w: 900,
    h: 500,

    running: false,
    elapsed: 0,
    sampleDuration: 10,
    count: 0,

    mysteryKind: pickMysteryKind(),

    dragging: false,
    dragOffsetX: 0,

    particles: [],
    emitAccumulator: 0,

    geom: {
      sourceRect: null,
      absorberRect: null,
      tubeRect: null,
      counterRect: null,
      wireA: null,
      wireB: null,
      detectorX: 0,
    },
  };

  function pickMysteryKind() {
    const kinds = ["alpha", "beta", "gamma"];
    return kinds[Math.floor(Math.random() * kinds.length)];
  }

  // ---------- Utilities ----------
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mapRange(x, inMin, inMax, outMin, outMax) {
    const t = (x - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
  }

  function poisson(lambda) {
    if (lambda <= 0) return 0;
    if (lambda < 30) {
      const L = Math.exp(-lambda);
      let k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    } else {
      const sd = Math.sqrt(lambda);
      const z = randn();
      return Math.max(0, Math.round(lambda + z * sd));
    }
  }

  function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function niceMaterialName(m) {
    if (m === "none") return "None";
    if (m === "paper") return "Paper";
    if (m === "aluminium") return "Aluminium";
    if (m === "lead") return "Lead";
    return m;
  }

  function kindForSelectedSource() {
    const key = (els.sourceSelect && els.sourceSelect.value) || "background";
    const def = SOURCE_DEFS[key] || SOURCE_DEFS.background;
    if (def.kind === "mystery") return state.mysteryKind;
    return def.kind;
  }

  function labelForSelectedSource() {
    const key = (els.sourceSelect && els.sourceSelect.value) || "background";
    const def = SOURCE_DEFS[key] || SOURCE_DEFS.background;
    if (def.kind === "mystery") return "Mystery source";
    return def.label;
  }

  // ---------- Controls ----------
  function syncDistanceReadout() {
    if (!els.distanceSlider || !els.distanceValue) return;
    els.distanceValue.textContent = String(els.distanceSlider.value);
  }

  function syncThicknessUI() {
    if (!els.absorberMaterial || !els.thicknessSlider || !els.thicknessValue || !els.thicknessUnit) return;

    const mat = els.absorberMaterial.value;
    const rng = THICKNESS_RANGES[mat] || THICKNESS_RANGES.none;

    els.thicknessSlider.min = String(rng.min);
    els.thicknessSlider.max = String(rng.max);
    els.thicknessSlider.step = "1";

    els.thicknessSlider.value = String(clamp(Number(els.thicknessSlider.value || 0), rng.min, rng.max));
    els.thicknessValue.textContent = String(els.thicknessSlider.value);
    els.thicknessUnit.textContent = rng.unit;

    if (mat === "none") {
      els.thicknessSlider.value = "0";
      els.thicknessValue.textContent = "0";
    }
  }

  function setControlsEnabled(enabled) {
    const controls = [
      els.sourceSelect,
      els.distanceSlider,
      els.absorberMaterial,
      els.thicknessSlider,
      els.sampleTime,
    ];
    controls.forEach((el) => { if (el) el.disabled = !enabled; });
    if (els.startBtn) els.startBtn.disabled = !enabled;
  }

  // ---------- Geometry ----------
  function absorberPixelWidth(mat, thicknessMm) {
    if (mat === "none" || thicknessMm <= 0) return 0;
    return clamp(ABSORB_PX.base + thicknessMm * ABSORB_PX.perMm, ABSORB_PX.base, ABSORB_PX.max);
  }

  function computeGeometry() {
    const w = state.w;
    const h = state.h;

    const pad = 16;
    const midY = h * 0.50;

    // Source block
    const sourceW = 52, sourceH = 46;
    const sourceX = pad + 18;
    const sourceY = midY - sourceH / 2;

    // Detector position from distance slider
    const dMin = Number(els.distanceSlider?.min ?? 2);
    const dMax = Number(els.distanceSlider?.max ?? 50);
    const dCm = Number(els.distanceSlider?.value ?? 15);

    const xMin = sourceX + sourceW + 120;
    const xMax = w - pad - 250;
    const detectorX = clamp(mapRange(dCm, dMin, dMax, xMin, xMax), xMin, xMax);

    // GM tube
    const tubeW = 140, tubeH = 34;
    const tubeX = detectorX - tubeW / 2;
    const tubeY = midY - tubeH / 2;

    // Counter block
    const counterW = 170, counterH = 70;
    const counterX = w - pad - counterW;
    const counterY = tubeY - 18;

    // Absorber slab
    const mat = els.absorberMaterial?.value ?? "none";
    const thicknessMm = Number(els.thicknessSlider?.value ?? 0);
    const absW = absorberPixelWidth(mat, thicknessMm);
    const absH = 120;

    const absX = lerp(sourceX + sourceW + 80, tubeX - 90, 0.5) - absW / 2;
    const absY = midY - absH / 2;

    // Wires: FROM RIGHT END of tube to bottom of counter
    const tubeRightX = tubeX + tubeW;
    const wireA = {
      x1: tubeRightX,
      y1: tubeY + tubeH * 0.35,
      cx1: tubeRightX + 40,
      cy1: tubeY + tubeH * 0.35 + 40,
      cx2: counterX + counterW * 0.20,
      cy2: counterY + counterH + 40,
      x2: counterX + counterW * 0.20,
      y2: counterY + counterH,
    };

    const wireB = {
      x1: tubeRightX,
      y1: tubeY + tubeH * 0.65,
      cx1: tubeRightX + 55,
      cy1: tubeY + tubeH * 0.65 + 55,
      cx2: counterX + counterW * 0.70,
      cy2: counterY + counterH + 50,
      x2: counterX + counterW * 0.70,
      y2: counterY + counterH,
    };

    state.geom = {
      detectorX,
      sourceRect: { x: sourceX, y: sourceY, w: sourceW, h: sourceH },
      absorberRect: { x: absX, y: absY, w: absW, h: absH },
      tubeRect: { x: tubeX, y: tubeY, w: tubeW, h: tubeH },
      counterRect: { x: counterX, y: counterY, w: counterW, h: counterH },
      wireA,
      wireB,
    };
  }

  // ---------- Physics ----------
  function transmission(kind, mat, thicknessMm, dCm) {
    if (kind === "background") return 1;

    const invSq = (D0_CM / Math.max(1e-6, dCm)) ** 2;
    const distanceFactor = clamp(invSq, 0.04, 4.0);

    let airFactor = 1;
    if (kind === "alpha") {
      airFactor = clamp(Math.exp(-dCm / AIR_RANGE_CM_ALPHA), 0, 1);
    }

    const k = (K_MM[kind] && K_MM[kind][mat]) ?? 0;
    const absFactor = Math.exp(-k * thicknessMm);

    return clamp(distanceFactor * airFactor * absFactor, 0, 10);
  }

  function currentCps() {
    const dCm = Number(els.distanceSlider?.value ?? 15);
    const mat = els.absorberMaterial?.value ?? "none";
    const thicknessMm = Number(els.thicknessSlider?.value ?? 0);
    const kind = kindForSelectedSource();

    const bg = BASE_CPS.background;
    if (kind === "background") return bg;

    const base = BASE_CPS[kind] ?? 0;
    return bg + base * transmission(kind, mat, thicknessMm, dCm);
  }

  // ---------- Particles ----------
  function spawnParticle(kind) {
    const g = state.geom;
    const s = g.sourceRect;
    const a = g.absorberRect;
    const t = g.tubeRect;

    const x = s.x + s.w + 6;
    const y = s.y + s.h / 2 + randn() * 6;

    const speed = kind === "alpha" ? 140 : kind === "beta" ? 220 : 300;
    const angle = randn() * (kind === "alpha" ? 0.09 : kind === "beta" ? 0.12 : 0.06);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const dCm = Number(els.distanceSlider?.value ?? 15);
    const mat = els.absorberMaterial?.value ?? "none";
    const thicknessMm = Number(els.thicknessSlider?.value ?? 0);

    // Survival probability for visuals (absorber + air only; distance changes density via emit rate)
    let airOnly = 1;
    if (kind === "alpha") airOnly = Math.exp(-dCm / AIR_RANGE_CM_ALPHA);

    const k = (K_MM[kind] && K_MM[kind][mat]) ?? 0;
    const absOnly = Math.exp(-k * thicknessMm);
    const surviveProb = clamp(airOnly * absOnly, 0, 1);

    return {
      kind,
      x,
      y,
      vx,
      vy,
      r: kind === "alpha" ? 3.6 : kind === "beta" ? 2.2 : 1.8,
      life: 0,
      maxLife: 1.8,
      state: "flying",
      willSurvive: Math.random() < surviveProb,
      trail: [],
      absorberRect: { x: a.x, y: a.y, w: a.w, h: a.h },
      tubeRect: { x: t.x, y: t.y, w: t.w, h: t.h },
    };
  }

  function updateParticles(dt) {
    const cps = currentCps();
    const kind = kindForSelectedSource();

    const emitRate = kind === "background" ? 0 : clamp(cps * 2.0, 0, 60);
    state.emitAccumulator += emitRate * dt;

    while (state.emitAccumulator >= 1) {
      state.emitAccumulator -= 1;
      if (state.particles.length < MAX_PARTICLES) state.particles.push(spawnParticle(kind));
      else break;
    }

    // move
    const a = state.geom.absorberRect;
    const t = state.geom.tubeRect;

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.life += dt;

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 12) p.trail.shift();

      if (p.state === "flying") {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.kind === "beta") {
          p.vy += randn() * 14 * dt;
        }

        // absorber hit (only if absorber is present)
        if (a.w > 0 && p.x >= a.x && p.x <= a.x + a.w && p.y >= a.y && p.y <= a.y + a.h) {
          if (!p.willSurvive) {
            p.state = "blocked";
            p.vx = 0;
            p.vy = 0;
          } else if (p.kind === "beta") {
            p.vy += randn() * 40 * dt;
          }
        }

        // tube hit -> remove
        const inTube =
          p.x >= t.x && p.x <= t.x + t.w &&
          p.y >= t.y && p.y <= t.y + t.h;

        if (inTube) {
          state.particles.splice(i, 1);
          continue;
        }
      }

      if (p.life > p.maxLife || p.x > state.w + 40 || p.y < -40 || p.y > state.h + 40) {
        state.particles.splice(i, 1);
      }
    }
  }

  // ---------- Counting ----------
  function updateCounts(dt) {
    if (!state.running) return;

    state.elapsed += dt;

    const cps = currentCps();
    state.count += poisson(cps * dt);

    if (state.elapsed >= state.sampleDuration) {
      stopRun(true);
    }
  }

  function startRun() {
    if (state.running) return;

    state.running = true;
    state.elapsed = 0;
    state.count = 0;

    state.sampleDuration = Number(els.sampleTime?.value ?? 10);

    setControlsEnabled(false);
    if (els.resetBtn) els.resetBtn.disabled = true;
  }

  function stopRun(addToTable) {
    state.running = false;

    setControlsEnabled(true);
    if (els.resetBtn) els.resetBtn.disabled = false;

    if (addToTable) addResultRow();
  }

  function resetAll() {
    stopRun(false);

    state.count = 0;
    state.elapsed = 0;
    state.particles.length = 0;
    state.emitAccumulator = 0;

    state.mysteryKind = pickMysteryKind();
    syncThicknessUI();
    render();
  }

  // ---------- Results ----------
  let trialIndex = 0;

  function addResultRow() {
    if (!els.resultsTable) return;

    const sourceLabel = labelForSelectedSource();
    const kind = (SOURCE_DEFS[els.sourceSelect?.value ?? "background"]?.kind === "mystery")
      ? "Mystery"
      : kindForSelectedSource();

    const dCm = Number(els.distanceSlider?.value ?? 15);
    const mat = els.absorberMaterial?.value ?? "none";
    const thicknessMm = Number(els.thicknessSlider?.value ?? 0);
    const t = state.sampleDuration;

    trialIndex++;

    const summary = `${state.count} counts in ${t}s`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${trialIndex}</td>
      <td>${sourceLabel}<div style="font-size:12px;color:${COLORS.slate};font-weight:600">${kind}</div></td>
      <td>${dCm}</td>
      <td>${niceMaterialName(mat)}</td>
      <td>${thicknessMm} ${els.thicknessUnit?.textContent ?? "mm"}</td>
      <td>${summary}</td>
      <td><button class="row-delete" title="Delete row" aria-label="Delete row">🗑</button></td>
    `;

    tr.querySelector(".row-delete")?.addEventListener("click", () => tr.remove());
    els.resultsTable.appendChild(tr);
  }

  function clearResults() {
    if (!els.resultsTable) return;
    els.resultsTable.innerHTML = "";
    trialIndex = 0;
  }

  // ---------- Canvas resize ----------
  function resizeCanvasToParent() {
    const rect = els.simArea.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const cssW = Math.max(320, Math.floor(rect.width));
    const cssH = Math.max(280, Math.floor(rect.height));

    els.canvas.style.width = cssW + "px";
    els.canvas.style.height = cssH + "px";
    els.canvas.width = Math.floor(cssW * dpr);
    els.canvas.height = Math.floor(cssH * dpr);

    state.dpr = dpr;
    state.w = cssW;
    state.h = cssH;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------- Drawing helpers ----------
  function roundRectPath(c, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  function drawWire(wire) {
    ctx.strokeStyle = "rgba(44,62,80,0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wire.x1, wire.y1);
    ctx.bezierCurveTo(wire.cx1, wire.cy1, wire.cx2, wire.cy2, wire.x2, wire.y2);
    ctx.stroke();
  }

  function drawGmTube(t) {
    // A simple rectangle with a horizontal gradient to suggest a cylinder
    const grad = ctx.createLinearGradient(t.x, 0, t.x + t.w, 0);
    grad.addColorStop(0.00, "#1f2e3b");  // darker edge
    grad.addColorStop(0.20, COLORS.navy);
    grad.addColorStop(0.50, "#3a5166");  // highlight
    grad.addColorStop(0.80, COLORS.navy);
    grad.addColorStop(1.00, "#1f2e3b");  // darker edge

    roundRectPath(ctx, t.x, t.y, t.w, t.h, 6);
    ctx.fillStyle = grad;
    ctx.fill();

    // subtle outline
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // end-cap line on right to sell the cylinder
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(t.x + t.w - 6, t.y + 4);
    ctx.lineTo(t.x + t.w - 6, t.y + t.h - 4);
    ctx.stroke();
  }

  function drawScene() {
    const g = state.geom;
    const s = g.sourceRect;
    const a = g.absorberRect;
    const t = g.tubeRect;
    const c = g.counterRect;

    ctx.clearRect(0, 0, state.w, state.h);

    // light texture grid
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = COLORS.navy;
    ctx.lineWidth = 1;
    for (let x = 0; x <= state.w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, state.h); ctx.stroke(); }
    for (let y = 0; y <= state.h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(state.w, y); ctx.stroke(); }
    ctx.restore();

    // Labels
    ctx.fillStyle = "rgba(44,62,80,0.75)";
    ctx.font = "600 13px Montserrat, system-ui, sans-serif";
    ctx.fillText("Source", s.x, s.y - 10);
    ctx.fillText("GM tube", t.x, t.y - 10);

    // Source block
    roundRectPath(ctx, s.x, s.y, s.w, s.h, 8);
    ctx.fillStyle = "rgba(44,62,80,0.10)";
    ctx.fill();
    ctx.strokeStyle = "rgba(44,62,80,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Source label
    ctx.fillStyle = COLORS.navy;
    ctx.font = "700 12px Montserrat, system-ui, sans-serif";
    const sourceKey = els.sourceSelect?.value ?? "background";
    const short =
      sourceKey === "am241" ? "Am-241" :
      sourceKey === "sr90" ? "Sr-90" :
      sourceKey === "cs137" ? "Cs-137" :
      sourceKey === "mystery" ? "?" :
      "BG";
    ctx.fillText(short, s.x + 10, s.y + s.h / 2 + 5);

    // Absorber slab (width responds to thickness)
    const mat = els.absorberMaterial?.value ?? "none";
    const thicknessMm = Number(els.thicknessSlider?.value ?? 0);
    if (a.w > 0 && mat !== "none" && thicknessMm > 0) {
      const fill =
        mat === "paper" ? "rgba(44,62,80,0.10)" :
        mat === "aluminium" ? "rgba(44,62,80,0.16)" :
        "rgba(44,62,80,0.22)";

      roundRectPath(ctx, a.x, a.y, a.w, a.h, 6);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = "rgba(44,62,80,0.30)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "rgba(44,62,80,0.75)";
      ctx.font = "600 12px Montserrat, system-ui, sans-serif";
      ctx.fillText(`${niceMaterialName(mat)} (${thicknessMm} mm)`, a.x, a.y - 10);
    }

    // GM tube (new style)
    drawGmTube(t);

    // Wires (from right end)
    drawWire(g.wireA);
    drawWire(g.wireB);

    // Counter block
    roundRectPath(ctx, c.x, c.y, c.w, c.h, 12);
    ctx.shadowColor = COLORS.shadow;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(44,62,80,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Counter screen + readout (counts + time)
    const screenPad = 12;
    const screen = { x: c.x + screenPad, y: c.y + screenPad, w: c.w - screenPad * 2, h: c.h - screenPad * 2 };
    roundRectPath(ctx, screen.x, screen.y, screen.w, screen.h, 10);
    ctx.fillStyle = "rgba(44,62,80,0.06)";
    ctx.fill();

    ctx.fillStyle = COLORS.navy;
    ctx.font = "700 22px Montserrat, system-ui, sans-serif";
    ctx.fillText(String(state.count), screen.x + 14, screen.y + 30);

    ctx.fillStyle = "rgba(44,62,80,0.70)";
    ctx.font = "600 12px Montserrat, system-ui, sans-serif";
    if (state.running) {
      const remaining = Math.max(0, state.sampleDuration - state.elapsed);
      ctx.fillText(`Counting… ${Math.ceil(remaining)}s`, screen.x + 14, screen.y + 52);
    } else {
      const tS = Number(els.sampleTime?.value ?? 10);
      ctx.fillText(`Sample time: ${tS}s`, screen.x + 14, screen.y + 52);
    }

    // Distance indicator (subtle dashed line)
    const sMidX = s.x + s.w;
    const sMidY = s.y + s.h / 2;
    const tMidX = t.x;
    const tMidY = t.y + t.h / 2;

    ctx.save();
    ctx.strokeStyle = "rgba(44,62,80,0.18)";
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sMidX + 8, sMidY);
    ctx.lineTo(tMidX - 10, tMidY);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    for (const p of state.particles) {
      const alpha = p.state === "blocked" ? 0.45 : 0.85;

      // trail
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = p.kind === "alpha" ? 4 : p.kind === "beta" ? 3 : 2;
      ctx.strokeStyle = p.kind === "alpha" ? COLORS.coral : p.kind === "beta" ? COLORS.teal : COLORS.navy;
      ctx.beginPath();
      for (let i = 0; i < p.trail.length; i++) {
        const pt = p.trail[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.restore();

      // particle
      ctx.save();
      ctx.globalAlpha = alpha;

      if (p.kind === "gamma") {
        ctx.strokeStyle = "rgba(44,62,80,0.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x - 6, p.y);
        ctx.lineTo(p.x + 6, p.y);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.kind === "alpha" ? COLORS.coral : COLORS.teal;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function render() {
    resizeCanvasToParent();
    computeGeometry();
    drawScene();
    drawParticles();
  }

  // ---------- Dragging (always available) ----------
  function pointerToCanvas(e) {
    const rect = els.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function tubeHitTest(px, py) {
    const t = state.geom.tubeRect;
    return px >= t.x && px <= t.x + t.w && py >= t.y && py <= t.y + t.h;
  }

  function detectorXToDistanceCm(detectorX) {
    const s = state.geom.sourceRect;
    const dMin = Number(els.distanceSlider?.min ?? 2);
    const dMax = Number(els.distanceSlider?.max ?? 50);

    const xMin = s.x + s.w + 120;
    const xMax = state.w - 16 - 250;

    const t = clamp((detectorX - xMin) / (xMax - xMin), 0, 1);
    return Math.round(lerp(dMin, dMax, t));
  }

  function onPointerDown(e) {
    if (state.running) return;

    const p = pointerToCanvas(e);
    computeGeometry();

    if (!tubeHitTest(p.x, p.y)) return;

    state.dragging = true;
    els.simArea.classList.add("dragging");

    const t = state.geom.tubeRect;
    state.dragOffsetX = p.x - (t.x + t.w / 2);

    els.canvas.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (state.running) return;

    const p = pointerToCanvas(e);

    // Cursor affordance
    computeGeometry();
    const hoveringTube = tubeHitTest(p.x, p.y);
    els.simArea.style.cursor = hoveringTube ? "grab" : "default";
    if (state.dragging) els.simArea.style.cursor = "grabbing";

    if (!state.dragging) return;

    const desiredCenterX = p.x - state.dragOffsetX;
    const newDCm = detectorXToDistanceCm(desiredCenterX);

    if (els.distanceSlider) els.distanceSlider.value = String(newDCm);
    syncDistanceReadout();
  }

  function onPointerUp(e) {
    if (!state.dragging) return;
    state.dragging = false;
    els.simArea.classList.remove("dragging");
    els.canvas.releasePointerCapture?.(e.pointerId);
  }

  // ---------- Loop ----------
  let last = performance.now();

  function tick(now) {
    const dt = clamp((now - last) / 1000, 0, 0.05);
    last = now;

    // keep thickness readout synced
    if (els.thicknessValue && els.thicknessSlider) {
      els.thicknessValue.textContent = String(els.thicknessSlider.value);
    }

    updateParticles(dt);
    updateCounts(dt);
    render();

    requestAnimationFrame(tick);
  }

  // ---------- Events ----------
  els.distanceSlider?.addEventListener("input", syncDistanceReadout);

  els.absorberMaterial?.addEventListener("change", syncThicknessUI);

  els.thicknessSlider?.addEventListener("input", () => {
    if (els.thicknessValue) els.thicknessValue.textContent = String(els.thicknessSlider.value);
  });

  els.startBtn?.addEventListener("click", startRun);
  els.resetBtn?.addEventListener("click", resetAll);
  els.clearResultsBtn?.addEventListener("click", clearResults);

  els.canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // ---------- Boot defaults ----------
  function ensureDefaults() {
    if (els.distanceSlider && !els.distanceSlider.value) els.distanceSlider.value = "15";
    syncDistanceReadout();
    syncThicknessUI();
  }

  ensureDefaults();
  render();
  requestAnimationFrame(tick);

  // ---------- Counting helpers (defined after boot calls above) ----------
  function updateCounts(dt) {
    if (!state.running) return;
    state.elapsed += dt;
    state.count += poisson(currentCps() * dt);
    if (state.elapsed >= state.sampleDuration) stopRun(true);
  }
})();
