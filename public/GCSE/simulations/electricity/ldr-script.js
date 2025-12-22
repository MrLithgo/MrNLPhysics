// LDR Light Level vs Resistance simulation
// Fixes applied:
// 1) Meter reading uses cached noisy value (stable for a given light% + preset).
// 2) addRow() records EXACTLY the same cached value as the meter display.
// 3) Table + CSV only include Light level (%) and Resistance (kΩ).

const els = {
  slider: document.getElementById('lightSlider'),
  lightPct: document.getElementById('lightPct'),
  rangeSelect: document.getElementById('rangeSelect'),
  resistanceValue: document.getElementById('resistanceValue'),
  resistanceUnit: document.getElementById('resistanceUnit'),
  addRowBtn: document.getElementById('addRowBtn'),
  resetBtn: document.getElementById('resetBtn'),
  clearTableBtn: document.getElementById('clearTableBtn'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  resultsBody: document.getElementById('resultsBody'),
  tableStatus: document.getElementById('tableStatus'),
  bulbGlow: document.getElementById('bulbGlow'),
  ldrWash: document.getElementById('ldrWash'),
}

let rows = []
let rowCounter = 0

const LDR_PRESETS = {
  classic: { Rdark: 120000, Rmin: 900, k: 22, gamma: 1.6 },
  highR: { Rdark: 300000, Rmin: 1200, k: 18, gamma: 1.7 },
  lowR: { Rdark: 70000, Rmin: 500, k: 26, gamma: 1.5 },
}

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x))
}

/* -----------------------
   Cached reading (noise fixed until settings change)
   ----------------------- */

let cached = {
  light: null,
  preset: null,
  noiseFactor: 1,
  R_ohms: 0,
}

function computeBaseResistance(lightPercent, presetKey) {
  const p = LDR_PRESETS[presetKey] || LDR_PRESETS.classic
  const L = clamp(Number(lightPercent), 0, 100)

  // Base curve: R(L) = Rmin + (Rdark - Rmin)/(1 + (L/k)^gamma)
  const denom = 1 + Math.pow(L / p.k, p.gamma)
  const R = p.Rmin + (p.Rdark - p.Rmin) / denom

  return clamp(R, p.Rmin, p.Rdark)
}

function getCachedReadingOhms(lightPercent, presetKey) {
  const light = Number(lightPercent)
  const preset = presetKey

  // Re-roll noise only if the settings changed
  if (cached.light !== light || cached.preset !== preset) {
    cached.light = light
    cached.preset = preset

    // Noise ALWAYS ON (±1.5%), but fixed for this setting
    const noise = Math.random() * 0.03 - 0.015
    cached.noiseFactor = 1 + noise

    const base = computeBaseResistance(light, preset)
    cached.R_ohms = clamp(base * cached.noiseFactor, 1, 1e12)
  }

  return cached.R_ohms
}

/* -----------------------
   Meter + visuals
   ----------------------- */

function formatForLCD(valueOhms) {
  // Meter can show Ω or kΩ, but table records kΩ only
  if (valueOhms >= 10000) {
    return { value: (valueOhms / 1000).toFixed(2), unit: 'kΩ' }
  }
  return { value: valueOhms.toFixed(0), unit: 'Ω' }
}

function updateVisuals(lightPercent) {
  const t = clamp(lightPercent, 0, 100) / 100

  if (els.bulbGlow) {
    els.bulbGlow.style.opacity = String(0.1 + 0.8 * t)
    els.bulbGlow.style.transform = `scale(${0.9 + 0.25 * t})`
  }

  const filament = document.querySelector('.bulb-filament')
  if (filament) {
    filament.style.boxShadow = `0 0 ${4 + 18 * t}px rgba(241,196,15,${0.1 + 0.45 * t})`
    filament.style.background = `rgba(241,196,15,${0.05 + 0.25 * t})`
  }

  if (els.ldrWash) {
    els.ldrWash.style.opacity = String(0.05 + 0.6 * t)
  }
}

function updateMeter() {
  const light = Number(els.slider.value)
  const preset = els.rangeSelect.value

  els.lightPct.textContent = `${light}%`

  // IMPORTANT: Use cached reading so it doesn't change randomly
  // and matches any recorded value.
  const R = getCachedReadingOhms(light, preset)
  const out = formatForLCD(R)

  els.resistanceValue.textContent = out.value
  els.resistanceUnit.textContent = out.unit

  updateVisuals(light)
  updateWirePositions()
}

/* -----------------------
   Status helper
   ----------------------- */

function showStatus(msg, kind = 'ready') {
  if (!els.tableStatus) return
  els.tableStatus.className = `status ${kind}`
  els.tableStatus.textContent = msg
  els.tableStatus.style.display = 'block'
  window.clearTimeout(showStatus._t)
  showStatus._t = window.setTimeout(() => {
    els.tableStatus.style.display = 'none'
  }, 2200)
}

/* -----------------------
   Table (Light % + Resistance kΩ only)
   ----------------------- */

function addRow() {
  const light = Number(els.slider.value)
  const preset = els.rangeSelect.value

  // FIX: record the SAME value as the meter display
  const R = getCachedReadingOhms(light, preset)

  rowCounter += 1
  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    n: rowCounter,
    light,
    R_ohms: R,
  }

  rows.push(record)
  renderTable()
  showStatus('Added reading.', 'ready')
}

function deleteRow(id) {
  rows = rows.filter((r) => r.id !== id)
  renderTable()
  showStatus('Row deleted.', 'ready')
}

function clearTable() {
  rows = []
  rowCounter = 0
  renderTable()
  showStatus('Table cleared.', 'ready')
}

function renderTable() {
  if (!els.resultsBody) return
  els.resultsBody.innerHTML = ''

  rows.forEach((r) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${r.light}</td>
      <td>${(r.R_ohms / 1000).toFixed(3)}</td>
      <td class="text-center">
        <button class="row-delete" type="button" data-id="${r.id}" title="Delete row">🗑</button>
      </td>
    `
    els.resultsBody.appendChild(tr)
  })

  els.resultsBody.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => deleteRow(btn.getAttribute('data-id')))
  })
}

function exportCSV() {
  if (rows.length === 0) {
    showStatus('Nothing to export yet.', 'running')
    return
  }

  const header = ['LightLevelPercent', 'Resistance_kOhm']
  const lines = [header.join(',')]

  rows.forEach((r) => {
    lines.push([r.light, (r.R_ohms / 1000).toFixed(3)].join(','))
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'ldr_results.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
  showStatus('CSV exported.', 'ready')
}

function resetSim() {
  els.slider.value = '50'
  els.rangeSelect.value = 'classic'

  // Clear cache so the reset produces a fresh (but stable) reading
  cached.light = null
  cached.preset = null

  updateMeter()
  showStatus('Reset complete.', 'ready')
}

/* -----------------------
   Wires (SVG)
   ----------------------- */

function getCenter(el) {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

function updateWirePositions() {
  const rig = document.getElementById('rig')
  const wireRed = document.getElementById('wireRed')
  const wireBlack = document.getElementById('wireBlack')

  const meterRed = document.getElementById('meterRed')
  const meterBlack = document.getElementById('meterBlack')
  const ldrLeft = document.getElementById('ldrLeft')
  const ldrRight = document.getElementById('ldrRight')

  if (!rig || !wireRed || !wireBlack || !meterRed || !meterBlack || !ldrLeft || !ldrRight) return

  const rigRect = rig.getBoundingClientRect()

  const A = getCenter(meterRed)
  const B = getCenter(ldrRight)
  const C = getCenter(meterBlack)
  const D = getCenter(ldrLeft)

  const a = { x: A.x - rigRect.left, y: A.y - rigRect.top }
  const b = { x: B.x - rigRect.left, y: B.y - rigRect.top }
  const c = { x: C.x - rigRect.left, y: C.y - rigRect.top }
  const d = { x: D.x - rigRect.left, y: D.y - rigRect.top }

  const bend = 70

  const redPath = `M ${a.x} ${a.y} C ${a.x - bend} ${a.y + 20}, ${b.x + bend} ${b.y + 18}, ${b.x} ${
    b.y
  }`
  const blackPath = `M ${c.x} ${c.y} C ${c.x - bend} ${c.y + 22}, ${d.x + bend} ${d.y + 20}, ${
    d.x
  } ${d.y}`

  wireRed.setAttribute('d', redPath)
  wireBlack.setAttribute('d', blackPath)
}

/* -----------------------
   Init
   ----------------------- */

function init() {
  if (!els.slider || !els.rangeSelect) return

  els.slider.addEventListener('input', updateMeter)
  els.rangeSelect.addEventListener('change', () => {
    // Changing preset should produce a new cached reading
    cached.light = null
    cached.preset = null
    updateMeter()
  })

  if (els.addRowBtn) els.addRowBtn.addEventListener('click', addRow)
  if (els.resetBtn) els.resetBtn.addEventListener('click', resetSim)
  if (els.clearTableBtn) els.clearTableBtn.addEventListener('click', clearTable)
  if (els.exportCsvBtn) els.exportCsvBtn.addEventListener('click', exportCSV)

  window.addEventListener('resize', updateWirePositions)

  updateMeter()
  renderTable()
  updateWirePositions()
}

document.addEventListener('DOMContentLoaded', init)
