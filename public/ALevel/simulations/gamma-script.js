// ---------- existing code (kept and slightly adjusted) ----------
const output = document.getElementById("output");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
const addSourceButton = document.getElementById("add-source");

// ✅ single source-of-truth for whether a source is present
let sourceVisible = false;
// ✅ controls whether the animation loop is running
let animationRunning = false;

const startStopButton = document.getElementById("start-stop-button");
const clearButton = document.getElementById("clear-button");
const countInput = document.getElementById("count");
let counting = false;
let count = 0;
let intervalId;
const materialColor = "grey";

const noiseCanvas = document.createElement("canvas");
noiseCanvas.width = 100;
noiseCanvas.height = 100;
const noiseCtx = noiseCanvas.getContext("2d");

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
      noiseCtx.fillStyle = "#808080";
    } else {
      noiseCtx.fillStyle = "#969696";
    }
    noiseCtx.fillRect(i, j, 1, 1);
  }
}
const concreteTexture = ctx.createPattern(noiseCanvas, "repeat");
// end noise texture setup

// If you still have a select element the code will reference it; if you replace it
// with the new dropdown HTML the dropdown code below will take precedence.
const materialSelect = document.getElementById("material");
const materials = {
  lead: {
    color: "grey",
    attenuationCoefficient: 1.64
  },
  aluminium: {
    color: "silver",
    attenuationCoefficient: 0.227
  },
  gold: {
    color: "#F6C324",
    attenuationCoefficient: 1.5
  },
  concrete: {
    color: "#808080",
    attenuationCoefficient: 0.15,
    texture: concreteTexture
  }
};

// ---------- help window (unchanged) ----------
document.getElementById("help-button").addEventListener("click", function () {
  // Create a new div element for the floating window
  var helpWindow = document.createElement("div");
  helpWindow.id = "help-window";
  helpWindow.style.position = "absolute";
  helpWindow.style.top = "50%";
  helpWindow.style.left = "50%";
  helpWindow.style.transform = "translate(-50%, -50%)";
  helpWindow.style.width = "60%";
  helpWindow.style.height = "100%";
  helpWindow.style.background = "white";
  helpWindow.style.border = "1px solid black";
  helpWindow.style.padding = "10px";
  helpWindow.style.zIndex = "1000";
  helpWindow.style.overflow = "auto";
  helpWindow.style.overflowY = "auto";

  // Add content to the floating window
  var helpContent = document.createElement("p");
  helpContent.innerHTML =
    '<h2 style="text-align:center;">Investigating Gamma Ray Absorption</h2><p><b>Aim of the Experiment</b></p><ul><li>To investigate the absorption of gamma rays by different thicknesses of lead </li></ul><p><b>Variables:</b></p><ul><li><b>Independent variable</b> = Thickness of lead</li><li><b>Dependent variable</b> = Count rate</li><li><b>Control variables:</b><ul><li>Radioactive source</li><li>Distance of GM tube to source</li><li>Location / background radiation</li></ul></ul><p><b>Method:</b></p><ol><li>Without any sources present, measure background radiation over a one minute period<ol><li>Record this value</li><li>Calculate the average background rate per minute</li></ul><li>Add the radioactive source</li><li>Press, ‘Start Count’ and record the count after one minute</li><li>Clear the count and repeat step 4 a further two times, recording the count rate each time</li><li>Increase the thickness of the absorber and record</li><li>Repeat steps 3-4</li><li>Increase the thickness of the absorber and continue taking three readings per thickness</li></ol><p><b>Analysis of Results</b></p><ul><li>Correct your count rate (counts per minute) by subtracting the background count rate</li><li>Plot a graph of corrected count rate (counts per minute) against thickness of the absorber</li></ul><p><b>Extension</b></p><ul><li>Repeat the experiment for different materials</li></ul><p><b>Further Analysis</b></p><ul><li>The count rate will drop according to the equation:</li><li><b><h2>C = C<sub>0</sub>e<sup>-&mu;x</sup></h2></b></li><li>Plot a graph of <b>ln C/C<sub>0</sub></b> against <b>x</b> (thickness in cm)</li><li>The gradient will be µ, the linear attenuation coefficient of the material (for photons of this energy)</li></ul>';
  helpWindow.appendChild(helpContent);

  // Add a close button to the floating window
  var closeButton = document.createElement("button");
  closeButton.innerHTML = "Close";
  closeButton.style.position = "absolute";
  closeButton.style.top = "20px";
  closeButton.style.right = "10px";
  closeButton.addEventListener("click", function () {
    helpWindow.remove();
  });
  helpWindow.appendChild(closeButton);

  // Add the floating window to the page
  document.body.appendChild(helpWindow);
});

window.currentMaterial = (materialSelect && materialSelect.value) ? materialSelect.value : "lead";

const materialDropdownGroup = document.getElementById("materialDropdownGroup");
if (materialDropdownGroup) {
  const materialDropdownBtn = document.getElementById("materialDropdownBtn");
  const materialDropdownList = document.getElementById("materialDropdownList");
  const materialLabel = document.getElementById("materialLabel");
  const materialItems = materialDropdownList ? materialDropdownList.querySelectorAll(".dropdown-item") : [];

  // helper
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // initialize label based on window.currentMaterial
  materialLabel.textContent = capitalize(window.currentMaterial);

  // set aria-selected states
  materialItems.forEach(i => i.setAttribute("aria-selected", (i.dataset.value === window.currentMaterial).toString()));

  let matDropdownOpen = false;

  function openMaterialDropdown() {
    materialDropdownList.style.display = "block";
    materialDropdownBtn.setAttribute("aria-expanded", "true");
    matDropdownOpen = true;
    const selectedEl = materialDropdownList.querySelector('[aria-selected="true"]');
    if (selectedEl) selectedEl.focus();
  }

  function closeMaterialDropdown() {
    materialDropdownList.style.display = "none";
    materialDropdownBtn.setAttribute("aria-expanded", "false");
    matDropdownOpen = false;
    materialDropdownBtn.focus();
  }

  // Toggle on click (works for touch + mouse)
  materialDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (matDropdownOpen) closeMaterialDropdown();
    else openMaterialDropdown();
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    if (matDropdownOpen) closeMaterialDropdown();
  });

  // Keyboard accessibility for button
  materialDropdownBtn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMaterialDropdown();
    }
    if (e.key === "Escape") {
      closeMaterialDropdown();
    }
  });

  // Item handlers
  materialItems.forEach(item => {
    item.tabIndex = 0;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectMaterial(item.dataset.value, item);
      closeMaterialDropdown();
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectMaterial(item.dataset.value, item);
        closeMaterialDropdown();
      }
      if (e.key === "Escape") {
        closeMaterialDropdown();
      }
    });
  });

  function selectMaterial(value, el) {
    if (!materials[value]) return;
    window.currentMaterial = value;
    materialLabel.textContent = el ? el.textContent : capitalize(value);
    // Update aria-selected states
    materialItems.forEach(i => i.setAttribute("aria-selected", (i.dataset.value === value).toString()));

    // If a legacy select exists, keep it synced (optional)
    if (materialSelect) materialSelect.value = value;

    // Trigger redraws
    if (typeof drawRectangle === "function") drawRectangle();
    if (typeof drawGeigerCounter === "function") drawGeigerCounter();
    if (sourceVisible && typeof drawSource === "function") drawSource(); // ✅ use boolean
  }
} else {
  // Fallback: keep using the select element (if present)
  if (materialSelect) {
    window.currentMaterial = materialSelect.value;
    materialSelect.addEventListener("change", () => {
      window.currentMaterial = materialSelect.value;
      if (typeof drawRectangle === "function") drawRectangle();
      if (typeof drawGeigerCounter === "function") drawGeigerCounter();
      if (sourceVisible && typeof drawSource === "function") drawSource(); // ✅ use boolean
    });
  }
}

// Also ensure calls elsewhere use currentMaterial; keep materialSelect listener too (if it exists)
if (materialSelect) {
  materialSelect.addEventListener("change", () => {
    window.currentMaterial = materialSelect.value;
  });
}

// ---------- timer + sizing + thickness UI (unchanged) ----------
const timerInput = document.getElementById("timer");
let timerRunning = false;
let timerTime = 0;
let timerIntervalId;

canvas.width = rect.width;
canvas.height = rect.height;

const thicknessSlider = document.getElementById("thickness");
const thicknessValue = document.getElementById("thickness-value");

// Updated drawRectangle uses window.currentMaterial (supports dropdown or select)
function drawRectangle() {
  let thickness = parseInt(document.getElementById("thickness").value);
  const rectHeight = 100;
  const rectWidth = thickness;
  const rectX = (canvas.width - rectWidth) / 2 - 50;
  const rectY = (canvas.height - rectHeight) / 2;

  // Use currentMaterial if present, otherwise fallback to select value or 'lead'
  const selectedMaterial = window.currentMaterial || (materialSelect ? materialSelect.value : "lead");

  if (materials[selectedMaterial] && materials[selectedMaterial].texture) {
    ctx.fillStyle = materials[selectedMaterial].texture;
  } else if (materials[selectedMaterial]) {
    ctx.fillStyle = materials[selectedMaterial].color;
  } else {
    ctx.fillStyle = "#808080"; // fallback
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
}

document.getElementById("thickness").addEventListener("input", () => {
  drawRectangle();
  drawGeigerCounter();
  if (sourceVisible) {
    drawSource(); // ✅ use boolean
  }
});

drawRectangle();

thicknessSlider.addEventListener("input", () => {
  thicknessValue.textContent = `${thicknessSlider.value} mm`;
});

function drawSource() {
  const sourceWidth = 40;
  const sourceHeight = 20;

  const sourceX = canvas.width / 4 - 90;
  const sourceY = canvas.height * 0.5 - 10;

  const gradient = ctx.createLinearGradient(
    sourceX,
    sourceY,
    sourceX,
    sourceY + sourceHeight
  );
  gradient.addColorStop(0, "rgba(128, 0, 0, 1)");
  gradient.addColorStop(0.5, "rgba(255, 0, 0, 1)");
  gradient.addColorStop(1, "rgba(128, 0, 0, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(sourceX, sourceY, sourceWidth, sourceHeight);
}

// ---------- SOURCE TOGGLE (REPLACED) ----------
// ✅ do NOT rely on button text for state; keep UI synced to sourceVisible
addSourceButton.addEventListener("click", () => {
  sourceVisible = !sourceVisible;
  addSourceButton.textContent = sourceVisible ? "Remove Source" : "Add Source";

  if (!sourceVisible) {
    // turn off source: clear photons and stop animation loop once photons are gone
    photons = [];
    animationRunning = false;
    lastTime = undefined;

    // draw static scene immediately
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRectangle();
    drawGeigerCounter();
    return;
  }

  // turn on source: start animation loop if not running
  if (!animationRunning) {
    animationRunning = true;
    lastTime = undefined;
    requestAnimationFrame(animateGammaPhotons);
  }
});

function drawGeigerCounter() {
  const gmTubeWidth = 40;
  const gmTubeHeight = 20;
  const gmTubeX = canvas.width * 0.5 + 180;
  const gmTubeY = canvas.height * 0.5 - 10;

  const gradient = ctx.createLinearGradient(
    gmTubeX,
    gmTubeY,
    gmTubeX,
    gmTubeY + gmTubeHeight
  );
  gradient.addColorStop(0, "rgba(128, 128, 128, 1)");
  gradient.addColorStop(0.5, "rgba(192, 192, 192, 1)");
  gradient.addColorStop(1, "rgba(128, 128, 128, 1)");

  ctx.fillStyle = gradient;
  ctx.fillRect(gmTubeX, gmTubeY, gmTubeWidth, gmTubeHeight);

  const thinTubeWidth = 20;
  const thinTubeHeight = 40;
  const thinTubeX = gmTubeX - thinTubeWidth;
  const thinTubeY = gmTubeY - (thinTubeHeight - gmTubeHeight) / 2;

  const thinGradient = ctx.createLinearGradient(
    thinTubeX,
    thinTubeY,
    thinTubeX,
    thinTubeY + thinTubeHeight
  );
  thinGradient.addColorStop(0, "rgba(128, 128, 128, 1)");
  thinGradient.addColorStop(0.5, "rgba(192, 192, 192, 1)");
  thinGradient.addColorStop(1, "rgba(128, 128, 128, 1)");

  ctx.fillStyle = thinGradient;
  ctx.fillRect(thinTubeX, thinTubeY, thinTubeWidth, thinTubeHeight);
}
drawGeigerCounter();

let cumulativeCount = 0;

function updateCount() {
  const countInput = document.getElementById("count");

  // ✅ source presence determined by boolean, not button text
  if (!sourceVisible) {
    const backgroundCount = Math.random() * 0.06;
    cumulativeCount += backgroundCount;
    countInput.value = Math.floor(cumulativeCount).toString();
    return;
  }

  const thickness = parseInt(document.getElementById("thickness").value) / 10;
  const selectedMaterial = window.currentMaterial || (materialSelect ? materialSelect.value : "lead");
  const attenuationCoefficient = materials[selectedMaterial].attenuationCoefficient;

  const sourceCount = 6 * Math.exp(-attenuationCoefficient * thickness);
  const backgroundCount = Math.random() * 0.06;
  cumulativeCount += sourceCount + backgroundCount;
  countInput.value = Math.floor(cumulativeCount).toString();
}

// start/stop UI logic (unchanged)
startStopButton.addEventListener("click", () => {
  if (counting) {
    clearInterval(intervalId);
    counting = false;
    startStopButton.textContent = "Start Count";

    clearInterval(timerIntervalId);
    timerRunning = false;
  } else {
    counting = true;
    startStopButton.textContent = "Stop Count";
    intervalId = setInterval(() => {
      updateCount();
    }, 100);

    timerRunning = true;
    timerTime = 0;
    timerIntervalId = setInterval(() => {
      timerTime++;
      const minutes = Math.floor(timerTime / 60);
      const seconds = timerTime % 60;
      timerInput.value = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }
});

clearButton.addEventListener("click", () => {
  count = 0;
  cumulativeCount = 0;
  countInput.value = "0";
  clearInterval(intervalId);
  counting = false;
  startStopButton.textContent = "Start Count";

  clearInterval(timerIntervalId);
  timerRunning = false;
  timerTime = 0;
  timerInput.value = "00:00";
});

// ---------- photon animation (updated to use sourceVisible + stop cleanly) ----------
let photons = [];
let lastTime;

function animateGammaPhotons(time) {
  // ✅ if source is off and no photons remain, stop the loop cleanly
  if (!sourceVisible && photons.length === 0) {
    animationRunning = false;
    lastTime = undefined;
    // draw static scene once
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRectangle();
    drawGeigerCounter();
    return;
  }

  if (!lastTime) lastTime = time;
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRectangle();
  drawGeigerCounter();

  if (sourceVisible) {
    drawSource();

    if (Math.random() < 0.3) {
      const sourceX = canvas.width / 4 - 90 + 20; // center of source rect
      const sourceY = canvas.height * 0.5 - 10 + 10 + (Math.random() * 10 - 5);

      photons.push({
        x: sourceX,
        y: sourceY,
        vx: 300,
        vy: Math.random() * 50 - 25,
        length: 15,
        thickness: 2,
        color: "grey",
        phaseOffset: Math.random() * 2 * Math.PI
      });
    }
  }

  // Move & draw photons
  for (let i = 0; i < photons.length; i++) {
    const p = photons[i];
    p.x += p.vx * deltaTime;
    p.y += p.vy * deltaTime;

    // Draw photon wavy line
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.atan2(p.vy, p.vx));
    ctx.beginPath();
    const amplitude = 4;
    const wavelength = 7;
    for (let j = 0; j < p.length; j++) {
      const x = j;
      const y = amplitude * Math.sin((2 * Math.PI * j) / wavelength + p.phaseOffset);
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.thickness;
    ctx.stroke();
    ctx.restore();

    const leadX = canvas.width * 0.5 - 50;
    if (p.x >= leadX && !p.hasPassedLead) {
      const leadThickness = parseInt(document.getElementById("thickness").value) * 0.05 + 0.0001;
      const selectedMaterial = window.currentMaterial || (materialSelect ? materialSelect.value : "lead");
      const attenuationCoefficient = materials[selectedMaterial].attenuationCoefficient;
      const probability = 0.7 * Math.exp(-attenuationCoefficient * leadThickness);

      if (Math.random() < probability) {
        p.hasPassedLead = true;
      } else {
        photons.splice(i, 1);
        i--;
        continue;
      }
    }

    if (
      p.x > canvas.width * 0.5 + 150 &&
      p.y > canvas.height * 0.5 - 20 &&
      p.y < canvas.height * 0.5 + 20
    ) {
      photons.splice(i, 1);
      i--;
      continue;
    }

    // Remove off-screen photons
    if (p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      photons.splice(i, 1);
      i--;
      continue;
    }
  }

  requestAnimationFrame(animateGammaPhotons);
}

// ----------------- Results table / recording (your code, with small fixes) -----------------
window.capturedResults = window.capturedResults || [];

// ✅ dedup to prevent accidental double-saves (same material/thickness/count/time)
function recordResult() {
  const material = window.currentMaterial || (materialSelect ? materialSelect.value : "lead");
  const thickness = (document.getElementById("thickness") ? parseInt(document.getElementById("thickness").value, 10) : 0);
  const countVal = (countInput && countInput.value !== "" ? parseInt(countInput.value, 10) : Math.floor(cumulativeCount || 0));
  const timeVal = (timerInput && timerInput.value ? timerInput.value : "00:00");

  const result = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    material,
    thickness_mm: thickness,
    count: isNaN(countVal) ? 0 : countVal,
    time: timeVal
  };

  const last = window.capturedResults.length ? window.capturedResults[window.capturedResults.length - 1] : null;
  if (last &&
      last.material === result.material &&
      last.thickness_mm === result.thickness_mm &&
      last.count === result.count &&
      last.time === result.time) {
    return null;
  }

  window.capturedResults.push(result);
  renderResultsTable();

  const saveBtn = document.getElementById("saveResultBtn");
  if (saveBtn) {
    saveBtn.classList.add("flash");
    setTimeout(() => saveBtn.classList.remove("flash"), 350);
  }

  return result;
}

function renderResultsTable() {
  const tbody = document.getElementById("resultsTable");
  if (!tbody) return;
  tbody.innerHTML = "";

  window.capturedResults.forEach((r, idx) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = idx + 1;
    tr.appendChild(tdIndex);

    const tdMat = document.createElement("td");
    tdMat.textContent = r.material;
    tr.appendChild(tdMat);

    const tdThick = document.createElement("td");
    tdThick.textContent = `${r.thickness_mm}`;
    tr.appendChild(tdThick);

    const tdCount = document.createElement("td");
    tdCount.textContent = r.count;
    tr.appendChild(tdCount);

    const tdTime = document.createElement("td");
    tdTime.textContent = r.time;
    tr.appendChild(tdTime);

    // ✅ Actions column = Delete row action
    const tdActions = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.className = "btn coral-btn"; // ✅ fixed className (no dot)
    delBtn.textContent = "Delete row";
    delBtn.setAttribute("aria-label", `Delete recorded row ${idx + 1}`);
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteResultById(r.id);
    });
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

function deleteResultById(id) {
  window.capturedResults = window.capturedResults.filter(r => r.id !== id);
  renderResultsTable();
}

function clearAllResults() {
  window.capturedResults = [];
  renderResultsTable();
}

const clearResultsBtn = document.getElementById("clearResultsBtn");
if (clearResultsBtn) {
  clearResultsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearAllResults();
  });
}

function exportResultsCSV(filename = "gamma_results.csv") {
  if (!window.capturedResults || window.capturedResults.length === 0) {
    alert("No results to export.");
    return;
  }

  const header = ["#","Material","Thickness_mm","Count","Time"];
  const rows = window.capturedResults.map((r, idx) => [
    idx + 1,
    `"${r.material}"`,
    r.thickness_mm,
    r.count,
    `"${r.time}"`
  ]);

  const csvContent = [header, ...rows].map(r => r.join(",")).join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

(function ensureExportButton() {
  const resultsPanel = document.querySelector(".panel.results");
  if (!resultsPanel) return;

  const footer = resultsPanel.querySelector(".panel-footer") || document.createElement("div");
  footer.classList.add("panel-footer");

  if (!document.getElementById("exportResultsBtn")) {
    const exportBtn = document.createElement("button");
    exportBtn.id = "exportResultsBtn";
    exportBtn.className = "btn teal-btn";
    exportBtn.textContent = "Export CSV";
    exportBtn.style.marginRight = "8px";
    exportBtn.addEventListener("click", () => exportResultsCSV());
    footer.insertBefore(exportBtn, footer.firstChild);
  }

  if (!resultsPanel.querySelector(".panel-footer")) resultsPanel.appendChild(footer);
})();

(function ensureSaveButton() {
  if (document.getElementById("saveResultBtn")) return;
  const controls = document.querySelector(".controls") || document.querySelector(".control-panel") || document.body;
  if (!controls) return;

  const saveBtn = document.createElement("button");
  saveBtn.id = "saveResultBtn";
  saveBtn.className = "btn gold-btn";
  saveBtn.textContent = "Save Result";
  saveBtn.style.marginTop = "8px";
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    recordResult();
  });

  const style = document.createElement("style");
  style.innerHTML = `
    .flash { transform: scale(1.02); box-shadow: 0 6px 18px rgba(2,8,23,0.12); transition: transform .12s ease;}
  `;
  document.head.appendChild(style);

  const startBtnEl = document.getElementById("start-stop-button");
  if (startBtnEl && startBtnEl.parentNode) {
    startBtnEl.parentNode.appendChild(saveBtn);
  } else {
    controls.appendChild(saveBtn);
  }
})();

renderResultsTable();
