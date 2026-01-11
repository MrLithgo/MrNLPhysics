;(() => {
  const canvas = document.getElementById('simCanvas')
  const ctx = canvas.getContext('2d')

  const els = {
    angleSlider: document.getElementById('angleSlider'),
    angleValue: document.getElementById('angleValue'),

    lambdaSlider: document.getElementById('lambdaSlider'),
    lambdaValue: document.getElementById('lambdaValue'),

    mat1: document.getElementById('mat1'),
    mat2: document.getElementById('mat2'),

    n1Value: document.getElementById('n1Value'),
    n2Value: document.getElementById('n2Value'),

    swapBtn: document.getElementById('swapBtn'),
    resetBtn: document.getElementById('resetBtn'),

    statusBadge: document.getElementById('statusBadge'),
    readout: document.getElementById('readout'),

    //advanced waves stuff
    viewToggle: document.getElementById('viewToggle'),
  }

  // ---------- helpers ----------
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x))
  const v = (x, y) => ({ x, y })
  const add = (a, b) => v(a.x + b.x, a.y + b.y)
  const mul = (a, s) => v(a.x * s, a.y * s)
  const len = (a) => Math.hypot(a.x, a.y)
  const norm = (a) => {
    const L = len(a) || 1
    return v(a.x / L, a.y / L)
  }
  const perp = (a) => v(-a.y, a.x)

  function wavelengthToColor(lambdaNm) {
    // Map visible spectrum (approx) to hue: 380nm ~ 270° (violet), 750nm ~ 0° (red)
    const t = Math.max(0, Math.min(1, (lambdaNm - 380) / (750 - 380)))
    const hue = 270 * (1 - t) // 270 -> 0

    // Stable, SimpliPhys-friendly: clamp saturation/lightness
    const sat = 70 // 0-100 (lower = calmer)
    const light = 45 // 0-100 (higher = brighter)
    return `hsl(${hue}, ${sat}%, ${light}%)`
  }

  // ---------- dispersion models ----------
  // Use λ in micrometres (µm) inside these formulas.
  // 1) BK7: 3-term Sellmeier (standard form)
  function n_BK7(lambda_um) {
    const B1 = 1.03961212
    const B2 = 0.231792344
    const B3 = 1.01046945
    const C1 = 0.00600069867
    const C2 = 0.0200179144
    const C3 = 103.560653
    const L2 = lambda_um * lambda_um
    const n2 = 1 + (B1 * L2) / (L2 - C1) + (B2 * L2) / (L2 - C2) + (B3 * L2) / (L2 - C3)
    return Math.sqrt(n2)
  }

  // 2) Water: 4-term Sellmeier-like (Daimon & Masumura)
  function n_Water(lambda_um) {
    const L2 = lambda_um * lambda_um
    const terms =
      (5.672526103e-1 * L2) / (L2 - 5.085550461e-3) +
      (1.736581125e-1 * L2) / (L2 - 1.814938654e-2) +
      (2.121531502e-2 * L2) / (L2 - 2.617260739e-2) +
      (1.138493213e-1 * L2) / (L2 - 1.073888649e1)
    return Math.sqrt(1 + terms)
  }

  // 3) Perspex (PMMA): single-term formula n^2 - 1 = 1.1819 λ^2/(λ^2 - 0.011313)
  function n_PMMA(lambda_um) {
    const L2 = lambda_um * lambda_um
    const n2 = 1 + (1.1819 * L2) / (L2 - 0.011313)
    return Math.sqrt(n2)
  }

  // 4) Diamond: n^2 - 1 = 0.3306 λ^2/(λ^2 - 0.1750^2) + 4.3356 λ^2/(λ^2 - 0.1060^2)
  function n_Diamond(lambda_um) {
    const L2 = lambda_um * lambda_um
    const n2 = 1 + (0.3306 * L2) / (L2 - 0.175 * 0.175) + (4.3356 * L2) / (L2 - 0.106 * 0.106)
    return Math.sqrt(n2)
  }

  function n_Air() {
    return 1.0003 // visible light, STP
  }

  function nMaterial(key, lambda_nm) {
    const lambda_um = lambda_nm / 1000 // nm -> µm
    switch (key) {
      case 'air':
        return n_Air()
      case 'water':
        return n_Water(lambda_um)
      case 'bk7':
        return n_BK7(lambda_um)
      case 'pmma':
        return n_PMMA(lambda_um)
      case 'diamond':
        return n_Diamond(lambda_um)
      default:
        return n_Water(lambda_um)
    }
  }

  function materialLabel(key) {
    switch (key) {
      case 'air':
        return 'Air'
      case 'water':
        return 'Water'
      case 'bk7':
        return 'Glass (BK7)'
      case 'pmma':
        return 'Perspex (PMMA)'
      case 'diamond':
        return 'Diamond'
      default:
        return 'Material'
    }
  }

  // ---------- canvas sizing ----------
  function resizeCanvasToParent() {
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function drawArrowBetween(a, b, color, alpha = 1) {
    drawArrow(a, { x: b.x - a.x, y: b.y - a.y }, color, alpha)
  }

  // ---------- drawing ----------
  function drawLine(p, dir, color, dash = [6, 6], alpha = 1) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = color
    ctx.lineWidth = 1.6
    ctx.setLineDash(dash || [])
    const d = norm(dir)
    const L = 5000
    ctx.beginPath()
    ctx.moveTo(p.x - d.x * L, p.y - d.y * L)
    ctx.lineTo(p.x + d.x * L, p.y + d.y * L)
    ctx.stroke()
    ctx.restore()
  }

  function drawArrow(p, dir, color, alpha = 1) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 3
    ctx.setLineDash([])

    const d = norm(dir)
    const L = 180 // shaft length
    const end = add(p, mul(d, L))

    // Draw full shaft
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()

    // Arrowhead halfway along
    const tHead = 0.5
    const q = add(p, mul(d, L * tHead)) // head centre point

    const head = 14 // head size
    const base = add(q, mul(d, -head)) // base point behind the tip
    const left = add(base, mul(perp(d), head * 0.65))
    const right = add(base, mul(perp(d), -head * 0.65))

    ctx.beginPath()
    ctx.moveTo(q.x, q.y) // tip at halfway
    ctx.lineTo(left.x, left.y)
    ctx.lineTo(right.x, right.y)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  function drawText(txt, x, y) {
    ctx.save()
    ctx.fillStyle = 'rgba(44,62,80,0.95)'
    ctx.font = `14px Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(txt, x, y)
    ctx.restore()
  }

  function compute() {
    const thetaI = (parseFloat(els.angleSlider.value) * Math.PI) / 180
    const lambda = parseFloat(els.lambdaSlider.value)
    const reflectOpacity = 0.15 + 0.75 * Math.pow(Math.sin(thetaI), 2)

    const m1 = els.mat1.value
    const m2 = els.mat2.value

    const n1 = nMaterial(m1, lambda)
    const n2 = nMaterial(m2, lambda)

    // Snell
    const s = (n1 / n2) * Math.sin(thetaI)
    const tir = s > 1

    let thetaT = NaN
    if (!tir) thetaT = Math.asin(s)

    let thetaC = NaN
    if (n1 > n2) thetaC = Math.asin(n2 / n1)

    return { thetaI, thetaT, thetaC, tir, lambda, n1, n2, m1, m2 }
  }

  function nToGrey(n, alpha = 0.35) {
    const nMin = 1.0
    const nMax = 2.5

    const t = Math.max(0, Math.min(1, (n - nMin) / (nMax - nMin)))

    // Subtle lightness range
    const lightness = 92 - t * 22 // 92% → 70%

    return `hsla(0, 0%, ${lightness}%, ${alpha})`
  }
  function radToDeg(x) {
    return (x * 180) / Math.PI
  }

  function drawAngleArc({
    P, // {x,y} vertex
    normalDir, // unit vector (0,1) downward
    rayDir, // unit vector along ray (in the medium)
    radius, // px
    color, // stroke/text color
    label, // "θᵢ" or "θt"
    valueDeg, // number
    side = 1, // +1 for right side, -1 for left (if you ever add left incidence)
  }) {
    const n = norm(normalDir)
    const r = norm(rayDir)

    // Angles in canvas coordinates
    const angN = Math.atan2(n.y, n.x)
    const angR = Math.atan2(r.y, r.x)

    // We want the smaller arc between normal and ray.
    // Ensure we draw the arc in the correct direction.
    let a0 = angN
    let a1 = angR

    // Normalize to [-pi, pi]
    const wrap = (a) => {
      while (a <= -Math.PI) a += 2 * Math.PI
      while (a > Math.PI) a -= 2 * Math.PI
      return a
    }

    let d = wrap(a1 - a0)

    // Force the arc to be the "inside" angle on the chosen side.
    // For right-bending setup, d should be positive for incident/refracted.
    if (side === 1 && d < 0) d += 2 * Math.PI
    if (side === -1 && d > 0) d -= 2 * Math.PI

    // Clamp to a sensible range (just in case)
    d = clamp(d, -Math.PI, Math.PI)
    a1 = a0 + d

    // Arc
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.9
    ctx.setLineDash([])

    ctx.beginPath()
    ctx.arc(P.x, P.y, radius, a0, a1, d < 0)
    ctx.stroke()

    // Label position near arc midpoint
    const mid = a0 + d * 0.55
    const tx = P.x + Math.cos(mid) * (radius + 14)
    const ty = P.y + Math.sin(mid) * (radius + 14)

    ctx.fillStyle = color
    ctx.font = `700 13px Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${label} = ${valueDeg.toFixed(1)}°`, tx, ty)

    ctx.restore()
  }

  //advanced waves stuff
  function drawWavefronts({ clipRect, anchorPoint, rayDir, spacingPx, count, color, alpha }) {
    // Wavefronts are lines perpendicular to rayDir. We draw a family of parallel lines.
    const d = norm(rayDir)
    const wfDir = perp(d) // direction along the wavefront line (perpendicular to propagation)

    ctx.save()

    // Clip to region (top or bottom medium)
    ctx.beginPath()
    ctx.rect(clipRect.x, clipRect.y, clipRect.w, clipRect.h)
    ctx.clip()

    ctx.strokeStyle = color
    ctx.globalAlpha = alpha
    ctx.lineWidth = 2
    ctx.setLineDash([]) // solid wavefronts

    const L = 70 // finite length, looks less “infinite”

    const half = Math.floor(count / 2)

    for (let k = -half; k <= half; k++) {
      const p0 = add(anchorPoint, mul(d, k * spacingPx)) // offset along propagation direction

      ctx.beginPath()
      ctx.moveTo(p0.x - wfDir.x * L, p0.y - wfDir.y * L)
      ctx.lineTo(p0.x + wfDir.x * L, p0.y + wfDir.y * L)
      ctx.stroke()
    }

    ctx.restore()
  }

  // Convert wavelength to a visually sensible pixel spacing.
  // Key physics: spacing ∝ λ_medium = λ0 / n
  function waveSpacingPx(lambdaNm, n) {
    const base = 34 // px spacing at 550nm in n=1 (tune for your look)
    return base * (lambdaNm / 550) * (1 / n)
  }

  function render() {
    resizeCanvasToParent()

    const w = canvas.getBoundingClientRect().width
    const h = canvas.getBoundingClientRect().height

    const by = h * 0.55
    const P = v(w * 0.55, by)

    ctx.clearRect(0, 0, w, h)

    // subtle media shading
    //ctx.fillStyle = "rgba(26,188,156,0.06)";
    // ctx.fillRect(0, 0, w, by);
    // ctx.fillStyle = "rgba(241,196,15,0.06)";
    // ctx.fillRect(0, by, w, h - by);

    // interface
    ctx.strokeStyle = 'rgba(44,62,80,0.25)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, by)
    ctx.lineTo(w, by)
    ctx.stroke()

    const { thetaI, thetaT, thetaC, tir, lambda, n1, n2, m1, m2 } = compute()
    const col = wavelengthToColor(lambda)
    ctx.fillStyle = nToGrey(n1)
    ctx.fillRect(0, 0, w, by)

    ctx.fillStyle = nToGrey(n2)
    ctx.fillRect(0, by, w, h - by)

    // normal
    drawLine(P, v(0, 1), 'rgba(44,62,80,0.28)')
    //advanced waves stuff
    const waveView = els.viewToggle.checked

    // ray dirs (bend right)
    const dI = norm(v(Math.sin(thetaI), Math.cos(thetaI))) // incident propagation direction in medium 1
    const dR = norm(v(Math.sin(thetaI), -Math.cos(thetaI))) // reflected propagation direction in medium 1
    const dT = tir ? null : norm(v(Math.sin(thetaT), Math.cos(thetaT))) // refracted propagation direction in medium 2

    // ---- WAVE VIEW ----
    if (waveView) {
      // Choose a calm line colour for wavefronts (navy-ish, not wavelength colour)
      const wfCol = 'rgba(44,62,80,0.55)'

      const topClip = { x: 0, y: 0, w, h: by }
      const botClip = { x: 0, y: by, w, h: h - by }

      // Spacing based on λ/n in each medium
      const s1 = waveSpacingPx(lambda, n1)
      const s2 = waveSpacingPx(lambda, n2)

      // Incident wavefronts in medium 1
      // Anchor a bit "upstream" so they fill the top region nicely
      const incidentAnchor = add(P, mul(dI, -2 * s1))
      drawWavefronts({
        clipRect: topClip,
        anchorPoint: incidentAnchor,
        rayDir: dI,
        spacingPx: s1,
        count: 13,
        color: wfCol,
        alpha: 0.85,
      })

      if (tir) {
        // Reflected wavefronts in medium 1
        const reflAnchor = add(P, mul(dR, 2 * s1))
        drawWavefronts({
          clipRect: topClip,
          anchorPoint: reflAnchor,
          rayDir: dR,
          spacingPx: s1,
          count: 11,
          color: wfCol,
          alpha: 0.55,
        })
      } else {
        // Refracted wavefronts in medium 2
        const transAnchor = add(P, mul(dT, 2 * s2))
        drawWavefronts({
          clipRect: botClip,
          anchorPoint: transAnchor,
          rayDir: dT,
          spacingPx: s2,
          count: 13,
          color: wfCol,
          alpha: 0.85,
        })
      }

      // Optional (recommended): draw faint rays as guides in wave mode
      // (keeps orientation obvious without dominating)
      const guideAlpha = 0.25
      const incidentStart = add(P, mul(dI, -180)) // upstream point (above P)
      drawArrow(incidentStart, dI, col, 1.0)
      if (tir) drawArrow(P, dR, col, guideAlpha)
      else {
        drawArrow(P, dT, col, guideAlpha)
        drawArrow(P, dR, col, guideAlpha)
      }
    }

    // ---- RAY VIEW ----
    else {
      // Your normal ray drawing here (full opacity, reflect opacity etc.)
      // Example:
      const reflectOpacity = 0.15 + 0.75 * Math.pow(Math.sin(thetaI), 2)

      // Incident (your arrowhead-halfway version)
      const incidentStart = add(P, mul(dI, -180)) // upstream point (above P)
      drawArrow(incidentStart, dI, col, 1.0)

      if (tir) {
        drawArrow(P, dR, col, 1.0)
      } else {
        drawArrow(P, dT, col, 0.9)
        drawArrow(P, dR, col, reflectOpacity)
      }
    }

    // marker
    // ctx.fillStyle = "rgba(44,62,80,0.85)";
    //ctx.beginPath();
    //ctx.arc(P.x, P.y, 5.5, 0, Math.PI * 2);
    //ctx.fill();

    // on-canvas readouts
    drawText(`λ = ${lambda.toFixed(0)} nm`, 14, 18)
    drawText(`n₁(λ) = ${n1.toFixed(4)}`, 14, 40)
    drawText(`n₂(λ) = ${n2.toFixed(4)}`, 14, by + 22)
    drawText(`θᵢ = ${((thetaI * 180) / Math.PI).toFixed(1)}°`, 14, 62)

    if (!tir) {
      drawText(`θt = ${((thetaT * 180) / Math.PI).toFixed(1)}°`, 14, by + 44)
    } else {
      drawText(`θt = — (TIR)`, 14, by + 44)
    }
    // UI labels
    els.n1Value.textContent = `n₁ ${n1.toFixed(3)}`
    els.n2Value.textContent = `n₂ ${n2.toFixed(3)}`

    // status badge (reuse your .status classes)

    const deg = (x) => (x * 180) / Math.PI

    let html = `<b>${materialLabel(m1)}</b> → <b>${materialLabel(m2)}</b><br>`
    html += `At λ = <b>${lambda.toFixed(0)} nm</b>: n₁ = <b>${n1.toFixed(
      4
    )}</b>, n₂ = <b>${n2.toFixed(4)}</b><br><br>`
    html += `θᵢ = <b>${deg(thetaI).toFixed(1)}°</b>. `

    if (!Number.isNaN(thetaC)) html += `θc(λ) = <b>${deg(thetaC).toFixed(1)}°</b>. `
    else html += `No critical angle (n₁ ≤ n₂). `

    if (tir) {
      html += `<br><b>TIR:</b> n₁(λ) sinθᵢ &gt; n₂(λ), so Snell would require sinθt &gt; 1.`
    } else {
      html += `<br>θt = <b>${deg(thetaT).toFixed(1)}°</b>.`
      html += `<br><span style="color:var(--slate)">Move λ to see dispersion change θt.</span>`
    }

    els.readout.innerHTML = html
  }

  function syncUI() {
    els.angleValue.textContent = `${els.angleSlider.value}°`
    els.lambdaValue.textContent = `${els.lambdaSlider.value} nm`
  }

  function onInput() {
    syncUI()
    render()
  }

  ;[els.angleSlider, els.lambdaSlider, els.mat1, els.mat2].forEach((el) => {
    el.addEventListener('input', onInput)
    el.addEventListener('change', onInput)
  })

  els.swapBtn.addEventListener('click', () => {
    const a = els.mat1.value
    els.mat1.value = els.mat2.value
    els.mat2.value = a
    onInput()
  })

  els.resetBtn.addEventListener('click', () => {
    els.angleSlider.value = '45'
    els.lambdaSlider.value = '550'
    els.mat1.value = 'air'
    els.mat2.value = 'bk7'

    onInput()
  })
  //advanced waves stuff
  els.viewToggle.addEventListener('change', onInput)

  // init
  syncUI()
  render()
  window.addEventListener('resize', render)
})()
