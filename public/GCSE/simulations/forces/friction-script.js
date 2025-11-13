document.addEventListener('DOMContentLoaded', function () {
  // --- Initialization guard to prevent multiple execution ---
  const initGuard = document.getElementById('initializationGuard')
  if (!initGuard) {
    // No guard element on this page → do nothing
    return
  }
  if (initGuard.hasAttribute('data-initialized')) {
    // Already initialized → skip
    return
  }
  initGuard.setAttribute('data-initialized', 'true')

  // --- Element references ---
  const experimentArea = document.getElementById('experimentArea')
  const blockContainer = document.getElementById('blockContainer')
  const block = document.getElementById('block')
  const weightsContainer = document.getElementById('weightsContainer')
  const string = document.getElementById('string')
  const newtonMeter = document.getElementById('newtonMeter')
  const meterReading = document.getElementById('meterReading')
  const meterTicks = document.getElementById('meterTicks')
  const surface = document.getElementById('surface')
  const addWeightBtn = document.getElementById('addWeight')
  const removeWeightBtn = document.getElementById('removeWeight')
  const resetBtn = document.getElementById('resetBtn')
  const recordDataBtn = document.getElementById('recordData')
  const clearDataBtn = document.getElementById('clearData')

  const dataTable = document.getElementById('dataTable')
  const totalMassDisplay = document.getElementById('totalMass')
  const forceDisplay = document.getElementById('forceDisplay')
  const kineticForceDisplay = document.getElementById('kineticForceDisplay')
  const surfaceOptions = document.querySelectorAll('.surface-option')
  const toast = document.getElementById('toast')

  // --- Essential elements check ---
  if (
    !experimentArea ||
    !blockContainer ||
    !block ||
    !string ||
    !newtonMeter ||
    !meterReading ||
    !meterTicks ||
    !surface ||
    !weightsContainer ||
    !dataTable ||
    !totalMassDisplay ||
    !forceDisplay ||
    !kineticForceDisplay ||
    !toast
  ) {
    console.error('Required simulation elements not found')
    return
  }

  // --- Simulation state variables ---
  let isDragging = false
  let isMoving = false
  let startX, currentX
  let blockMass = 1.0 // kg
  let currentForce = 0 // N
  let kineticFrictionForce = 0 // N
  let stableKineticForce = 0 // N (for recording)
  let staticFrictionForce = 0 // N
  let currentFriction = 0.3 // default μ
  let staticFrictionRatio = 1.2
  let currentSurface = 'wood'
  const gravity = 9.8 // m/s²
  const maxPull = 30 // N

  let wobbleInterval
  let hasMovedBlock = false
  let justStartedMoving = false

  let blockInitialX
  let meterInitialX
  const EDGE_PADDING = 2

  // --- Initial positions computation ---
  function computeInitialPositions() {
    const areaWidth = experimentArea.clientWidth || 800

    if (window.innerWidth <= 767) {
      // Mobile
      meterInitialX = Math.max(EDGE_PADDING, Math.floor(areaWidth * 0.2))
      blockInitialX = Math.max(EDGE_PADDING + 100, Math.floor(areaWidth * 0.6))
    } else if (window.innerWidth <= 1023) {
      // Tablet
      meterInitialX = Math.max(EDGE_PADDING, Math.floor(areaWidth * 0.25))
      blockInitialX = Math.max(EDGE_PADDING + 120, Math.floor(areaWidth * 0.7))
    } else {
      // Desktop
      meterInitialX = Math.max(EDGE_PADDING, Math.floor(areaWidth * 0.45))
      blockInitialX = Math.max(EDGE_PADDING + 150, Math.floor(areaWidth * 0.9))
    }

    meterInitialX = Math.min(meterInitialX, areaWidth - newtonMeter.offsetWidth - EDGE_PADDING)
    blockInitialX = Math.min(blockInitialX, areaWidth - block.offsetWidth - EDGE_PADDING)

    meterInitialX = Math.max(EDGE_PADDING, meterInitialX)
    blockInitialX = Math.max(EDGE_PADDING, blockInitialX)
  }

  function clampX(x, element) {
    const minX = EDGE_PADDING
    const maxX = Math.max(minX, experimentArea.clientWidth - element.offsetWidth - EDGE_PADDING)
    return Math.min(maxX, Math.max(minX, x))
  }

  function updateBlockPosition(x) {
    blockContainer.style.left = clampX(x, block) + 'px'
  }

  function updateMeterPosition(x) {
    newtonMeter.style.left = clampX(x, newtonMeter) + 'px'
  }

  function initPositions() {
    computeInitialPositions()
    updateMeterPosition(meterInitialX)
    updateBlockPosition(blockInitialX)
    updateString()
  }

  // --- Meter ticks & reading ---
  function createMeterTicks() {
    meterTicks.innerHTML = ''

    const meterWidth = window.innerWidth <= 767 ? 160 : 180
    const leftPadding = window.innerWidth <= 767 ? 8 : 10
    const usableWidth = meterWidth - leftPadding * 2

    for (let i = 0; i <= 30; i++) {
      const tick = document.createElement('div')
      tick.className = i % 10 === 0 ? 'meter-tick major' : 'meter-tick'

      const position = (i / 30) * usableWidth + leftPadding
      tick.style.left = position + 'px'

      meterTicks.appendChild(tick)
    }
  }

  function updateMeterReading(force) {
    const meterWidth = window.innerWidth <= 767 ? 160 : 180
    const leftPadding = window.innerWidth <= 767 ? 8 : 10
    const usableWidth = meterWidth - leftPadding * 2

    const clampedForce = Math.max(0, Math.min(maxPull, force))
    const readingPosition = (clampedForce / maxPull) * usableWidth + leftPadding
    meterReading.style.left = readingPosition + 'px'
  }

  // --- String geometry ---
  function updateString() {
    const meterWidth = window.innerWidth <= 767 ? 160 : 180

    const blockLeft = parseInt(blockContainer.style.left) || blockInitialX
    const meterLeft = parseInt(newtonMeter.style.left) || meterInitialX
    const meterRight = meterLeft + meterWidth

    const stringLeft = meterRight
    const stringWidth = Math.max(0, blockLeft - meterRight)

    string.style.left = stringLeft + 'px'
    string.style.width = stringWidth + 'px'

    const blockBottom = parseInt(blockContainer.style.bottom || 30, 10)
    const stringY = experimentArea.offsetHeight - blockBottom - (window.innerWidth <= 767 ? 35 : 40)
    string.style.top = stringY + 'px'
  }

  // --- Drag & friction logic ---
  function addRandomness(value, percentRange) {
    const randomFactor = 1 + (Math.random() * percentRange * 2 - percentRange)
    return value * randomFactor
  }

  function startDrag(e) {
    isDragging = true
    newtonMeter.classList.add('dragging')
    startX = e.clientX || (e.touches && e.touches[0].clientX)
    currentX = parseInt(newtonMeter.style.left) || meterInitialX

    if (wobbleInterval) {
      clearInterval(wobbleInterval)
      wobbleInterval = null
    }

    isMoving = false
    justStartedMoving = false

    e.preventDefault()
  }

  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      startDrag(e)
    }
  }

  function drag(e) {
    if (!isDragging) return

    let clientX = e.clientX || (e.touches && e.touches[0].clientX)
    if (!clientX) return

    const deltaX = clientX - startX
    let newMeterX = Math.max(EDGE_PADDING, Math.min(meterInitialX, currentX + deltaX))

    // Pull distance relative to original meter position
    const pullDistance = meterInitialX - newMeterX

    // Base friction forces
    const baseKineticFrictionForce = blockMass * gravity * currentFriction
    const baseStaticFrictionForce = baseKineticFrictionForce * staticFrictionRatio

    // Add randomness (±3%)
    kineticFrictionForce = addRandomness(baseKineticFrictionForce, 0.03)
    staticFrictionForce = addRandomness(baseStaticFrictionForce, 0.03)

    // Force from position
    let rawForce = ((pullDistance / 20) * maxPull) / 5

    let newBlockX = blockInitialX

    if (!isMoving && rawForce > staticFrictionForce) {
      // Block just starts moving
      isMoving = true
      justStartedMoving = true
      hasMovedBlock = true

      stableKineticForce = kineticFrictionForce

      kineticForceDisplay.textContent = stableKineticForce.toFixed(2) + ' N'
      kineticForceDisplay.classList.add('highlight')
      setTimeout(() => {
        kineticForceDisplay.classList.remove('highlight')
      }, 500)

      setTimeout(() => {
        justStartedMoving = false
      }, 200)
    }

    if (isMoving) {
      if (justStartedMoving) {
        currentForce = rawForce
      } else {
        currentForce = kineticFrictionForce
      }

      newBlockX = blockInitialX - (pullDistance - (staticFrictionForce * 20 * 5) / maxPull)

      if (!wobbleInterval && !justStartedMoving) {
        startWobble()
      }
    } else {
      currentForce = rawForce
      newBlockX = blockInitialX
    }

    forceDisplay.textContent = currentForce.toFixed(2) + ' N'

    updateMeterPosition(newMeterX)
    updateBlockPosition(newBlockX)

    if (!wobbleInterval) {
      updateMeterReading(currentForce)
    }

    updateString()

    e.preventDefault()
  }

  function handleTouchMove(e) {
    drag(e)
  }

  function endDrag() {
    if (!isDragging) return
    isDragging = false
    newtonMeter.classList.remove('dragging')

    resetPositions(false)

    if (wobbleInterval) {
      clearInterval(wobbleInterval)
      wobbleInterval = null
    }

    isMoving = false
    justStartedMoving = false
  }

  function handleTouchEnd() {
    endDrag()
  }

  function startWobble() {
    if (wobbleInterval) {
      clearInterval(wobbleInterval)
    }

    wobbleInterval = setInterval(() => {
      const wobbleAmount = addRandomness(stableKineticForce, 0.05)
      updateMeterReading(wobbleAmount)
      forceDisplay.textContent = wobbleAmount.toFixed(2) + ' N'
    }, 150)
  }

  // --- Surface & reset ---
  function updateSurface(surfaceType, frictionValue, staticRatio) {
    surface.classList.remove('surface-wood', 'surface-ice', 'surface-carpet', 'surface-rubber')

    surface.classList.add('surface-' + surfaceType)

    currentSurface = surfaceType
    if (typeof frictionValue === 'number') {
      currentFriction = frictionValue
    }
    if (typeof staticRatio === 'number') {
      staticFrictionRatio = staticRatio
    }

    resetPositions(true)

    kineticFrictionForce = 0
    stableKineticForce = 0
    kineticForceDisplay.textContent = '0.00 N'
    hasMovedBlock = false
  }

  function resetPositions(resetKineticForce = false) {
    updateMeterPosition(meterInitialX)
    updateBlockPosition(blockInitialX)
    updateMeterReading(0)
    updateString()
    currentForce = 0
    forceDisplay.textContent = '0.00 N'

    if (resetKineticForce) {
      kineticFrictionForce = 0
      stableKineticForce = 0
      kineticForceDisplay.textContent = '0.00 N'
    }

    if (wobbleInterval) {
      clearInterval(wobbleInterval)
      wobbleInterval = null
    }

    isMoving = false
    justStartedMoving = false
  }

  // --- Weights & mass ---
  function updateMassDisplay() {
    totalMassDisplay.textContent = `Total: ${blockMass.toFixed(1)} kg`
  }

  function addWeight() {
    if (weightsContainer.children.length >= 5) return

    const weight = document.createElement('div')
    weight.className = 'weight'
    weightsContainer.appendChild(weight)

    blockMass += 0.5
    updateMassDisplay()

    kineticFrictionForce = 0
    stableKineticForce = 0
    kineticForceDisplay.textContent = '0.00 N'
    hasMovedBlock = false
  }

  function removeWeight() {
    if (weightsContainer.children.length > 0) {
      weightsContainer.removeChild(weightsContainer.lastChild)
      blockMass -= 0.5
      updateMassDisplay()

      kineticFrictionForce = 0
      stableKineticForce = 0
      kineticForceDisplay.textContent = '0.00 N'
      hasMovedBlock = false
    }
  }

  function resetExperiment() {
    resetPositions(true)

    weightsContainer.innerHTML = ''
    blockMass = 1.0
    updateMassDisplay()

    updateSurface('wood', 0.3, 1.2)

    surfaceOptions.forEach((opt) => opt.classList.remove('active'))
    const woodButton = document.querySelector('[data-surface="wood"]')
    if (woodButton) woodButton.classList.add('active')

    kineticFrictionForce = 0
    stableKineticForce = 0
    kineticForceDisplay.textContent = '0.00 N'
    hasMovedBlock = false
  }
  function clearData() {
    // Remove all rows from the table body
    dataTable.innerHTML = ''

    // Optional: give feedback
    showToast('All data cleared')
  }

  // --- Data recording & toast ---
  function recordDataPoint() {
    if (!hasMovedBlock || stableKineticForce === 0) {
      showToast('Pull until the block moves first', 'warning')
      return
    }

    const row = document.createElement('tr')

    const surfaceName = currentSurface.charAt(0).toUpperCase() + currentSurface.slice(1)
    const recordedForce = stableKineticForce

    const calculatedMu = (recordedForce / (blockMass * gravity)).toFixed(2)

    row.innerHTML = `
      <td>${surfaceName}</td>
      <td>${blockMass.toFixed(1)}</td>
      <td>${recordedForce.toFixed(2)}</td>
      <td>${calculatedMu}</td>
    `

    row.style.backgroundColor = '#e6fffa'
    dataTable.appendChild(row)

    setTimeout(() => {
      row.style.transition = 'background-color 1s ease'
      row.style.backgroundColor = 'transparent'
    }, 100)

    showToast('Data point recorded!')
  }

  function showToast(message, type = 'success') {
    toast.textContent = message
    toast.className = 'toast'

    if (type === 'warning') {
      toast.style.backgroundColor = '#ff9800'
    } else {
      toast.style.backgroundColor = '#4CAF50'
    }

    toast.classList.add('show')

    setTimeout(() => {
      toast.classList.remove('show')
    }, 3000)
  }

  // --- Event listeners ---
  if (newtonMeter) {
    newtonMeter.addEventListener('mousedown', startDrag)
    newtonMeter.addEventListener('touchstart', handleTouchStart)
  }

  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', handleTouchEnd)

  if (addWeightBtn) addWeightBtn.addEventListener('click', addWeight)
  if (removeWeightBtn) removeWeightBtn.addEventListener('click', removeWeight)
  if (resetBtn) resetBtn.addEventListener('click', resetExperiment)
  if (recordDataBtn) recordDataBtn.addEventListener('click', recordDataPoint)
  if (clearDataBtn) clearDataBtn.addEventListener('click', clearData)

  if (surfaceOptions && surfaceOptions.length > 0) {
    surfaceOptions.forEach((option) => {
      option.addEventListener('click', function () {
        const surfaceType = this.getAttribute('data-surface')
        const frictionValue = parseFloat(this.getAttribute('data-friction'))
        const staticRatio = parseFloat(this.getAttribute('data-static-ratio'))
        updateSurface(surfaceType, frictionValue, staticRatio)

        surfaceOptions.forEach((opt) => opt.classList.remove('active'))
        this.classList.add('active')
      })
    })

    const woodSurface = document.querySelector('[data-surface="wood"]')
    if (woodSurface) woodSurface.classList.add('active')
  }

  // --- Resize handler ---
  window.addEventListener('resize', function () {
    computeInitialPositions()

    const currentMeterX = clampX(parseInt(newtonMeter.style.left || meterInitialX, 10), newtonMeter)
    const currentBlockX = clampX(parseInt(blockContainer.style.left || blockInitialX, 10), block)

    updateMeterPosition(currentMeterX)
    updateBlockPosition(currentBlockX)

    updateString()
    updateMeterReading(currentForce || 0)
  })

  // --- Initial setup ---
  updateMassDisplay()
  createMeterTicks()
  initPositions()
  updateSurface('wood', 0.3, 1.2)
  updateMeterReading(0)
})
