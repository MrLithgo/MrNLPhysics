// Circuit Builder - Interactive Physics Simulation
// Full rewrite: proper net (node) building + MNA solver
// EDITED: "component value" now edits selected component + selected highlight + voltmeter reads only when both leads wired

class UnionFind {
  constructor() {

    this.parent = new Map();
    this.rank = new Map();
  }
  _make(x) {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }
  find(x) {
    this._make(x);
    let p = this.parent.get(x);
    if (p !== x) {
      p = this.find(p);
      this.parent.set(x, p);
    }
    return p;
  }
  union(a, b) {
    a = this.find(a);
    b = this.find(b);
    if (a === b) return;

    const ra = this.rank.get(a);
    const rb = this.rank.get(b);

    if (ra < rb) this.parent.set(a, b);
    else if (ra > rb) this.parent.set(b, a);
    else {
      this.parent.set(b, a);
      this.rank.set(a, ra + 1);
    }
  }
}

class CircuitBuilder {
  constructor() {
    this.palettePick = null;     // { type, value } when user taps a palette item
this.paletteEl = null;       // DOM element to highlight (optional)
this.paletteDrag = null; // { type, value, ghost, pointerId, startX, startY, lastX, lastY }


this.isTouchLike = (e) =>
  e.pointerType === "touch" ||
  e.pointerType === "pen" ||
  window.matchMedia("(hover: none)").matches;

this.activePointerId = null;
this._touchId = null;
this._touchDragging = false;


    this.canvas = document.getElementById("circuit-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Circuit state
    this.components = [];
    this.wires = [];
    this.gridSize = 40;
    this.nextId = 1;

    // Interaction state
    this.draggedComponent = null;
    this.deleteMode = false;

    // Wire drawing state
    this.isDrawingWire = false;
    this.currentWirePath = []; // Array of {x,y}

    // Component dragging on canvas
    this.draggedCanvasComponent = null;
    this.dragOffset = { x: 0, y: 0 };

    // Settings
    this.showGrid = true;
    this.showValues = true;
    this.batteryVoltage = 6;

    // EDITED: slider is now the "component value" editor
    this.componentValue = 10;
    this.selectedComponentId = null;

    // Solver state cache (for meters / display)
    this.lastSolve = null; // { nodeV, nodeOfTerminal(compId,pin), branchIById }

    // Animation
    this.animationFrame = 0;

    this.init();
  }
  positionGhostImmediate(clientX, clientY) {
    if (!this.paletteDrag || !this.paletteDrag.ghost) return;

    const { ghost, offX, offY } = this.paletteDrag;

    // Position ghost instantly at finger position
    const x = clientX - offX;
    const y = clientY - offY;

    // Only update transform - this is the fastest way to move an element
    ghost.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  startPaletteGhostDrag(e, item, type, value) {
    // build ghost
    const ghost = item.cloneNode(true);
    ghost.classList.add("component-ghost");
    ghost.classList.remove("dragging");

    ghost.style.width = "120px";
    ghost.style.background = "rgba(255,255,255,0.92)";
    ghost.style.borderRadius = "12px";
    ghost.style.padding = "8px 10px";
    ghost.style.border = "1px solid rgba(0,0,0,0.08)";
    ghost.style.position = "fixed";
    ghost.style.left = "0";
    ghost.style.top = "0";
    ghost.style.pointerEvents = "none";
    ghost.style.touchAction = "none"; // Prevent browser touch handling
    ghost.style.zIndex = "10000";
    ghost.style.willChange = "transform"; // GPU acceleration hint

    const r = item.getBoundingClientRect();

    // Finger offset within the palette item
    const offX = e.clientX - r.left;
    const offY = e.clientY - r.top;

    this.paletteDrag = {
      type,
      value,
      ghost,
      pointerId: e.pointerId,
      offX,
      offY,
      lastX: e.clientX,
      lastY: e.clientY,
    };

    // Append to body
    document.body.appendChild(ghost);

    // Position immediately at finger
    this.positionGhostImmediate(e.clientX, e.clientY);

    // Capture pointer for reliability
    try { item.setPointerCapture(e.pointerId); } catch {}
  }


tryDropPaletteItemToCanvas(clientX, clientY, type, value) {
  const rect = this.canvas.getBoundingClientRect();

  const inside =
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom;

  if (!inside) return false;

  const x = this.snapToGrid(clientX - rect.left);
  const y = this.snapToGrid(clientY - rect.top);

  const collision = this.components.find(
    (c) => Math.abs(c.x - x) < this.gridSize && Math.abs(c.y - y) < this.gridSize
  );
  if (collision) return false;

  const component = {
    id: this.nextId++,
    type,
    x,
    y,
    value: type === "battery" ? this.batteryVoltage : this.componentValue,
    current: 0,
    voltage: 0,
    orientation: "horizontal",
  };

  this.components.push(component);
  this.selectedComponentId = component.id;
  this.syncComponentValueUI(component);

  this.calculateCircuit();
  return true;
}
onPaletteGhostMove(e) {
  if (!this.paletteDrag) return;
  if (e.pointerId !== this.paletteDrag.pointerId) return;

  e.preventDefault();
  e.stopPropagation();

  // Use coalesced events to get ALL intermediate positions for smooth tracking
  const coalescedEvents = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

  // Get predicted events for lower latency (anticipates finger movement)
  const predictedEvents = e.getPredictedEvents ? e.getPredictedEvents() : [];

  // Use predicted position if available (lowest latency), otherwise use latest coalesced
  const events = predictedEvents.length > 0 ? predictedEvents : coalescedEvents;
  const latestEvent = events[events.length - 1];

  this.paletteDrag.lastX = latestEvent.clientX;
  this.paletteDrag.lastY = latestEvent.clientY;

  // Update ghost to latest/predicted position immediately
  this.positionGhostImmediate(this.paletteDrag.lastX, this.paletteDrag.lastY);
}

onPaletteGhostUp(e, isCancel) {
  if (!this.paletteDrag) return;
  if (e.pointerId !== this.paletteDrag.pointerId) return;

  e.preventDefault();
  e.stopPropagation();

  const { ghost, type, value, lastX, lastY } = this.paletteDrag;

  if (ghost && ghost.parentNode) {
    ghost.style.willChange = "auto"; // Release GPU resources
    ghost.parentNode.removeChild(ghost);
  }

  if (isCancel) {
    this.paletteDrag = null;
    return;
  }

  this.tryDropPaletteItemToCanvas(lastX, lastY, type, value);
  this.paletteDrag = null;
}


tryDropPaletteItemToCanvas(clientX, clientY, type, value) {
  const rect = this.canvas.getBoundingClientRect();

  const inside =
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom;

  if (!inside) return false;

  // Convert to canvas coords
  const x = this.snapToGrid(clientX - rect.left);
  const y = this.snapToGrid(clientY - rect.top);

  // Collision check
  const collision = this.components.find(
    (c) => Math.abs(c.x - x) < this.gridSize && Math.abs(c.y - y) < this.gridSize
  );
  if (collision) return false;

  const component = {
    id: this.nextId++,
    type,
    x,
    y,
    value: type === "battery" ? this.batteryVoltage : this.componentValue,
    current: 0,
    voltage: 0,
    orientation: "horizontal",
  };

  this.components.push(component);

  // Select newly placed component
  this.selectedComponentId = component.id;
  this.syncComponentValueUI(component);

  this.calculateCircuit();
  this.updateHint();

  return true;
}
onTouchStart(e) {
  // Stop page scrolling/zoom stealing the gesture
  e.preventDefault();

  const t = e.changedTouches[0];
  this._touchId = t.identifier;
  this._touchDragging = true;

  // Route into your pointer pipeline
  this.handlePointerDown({
    clientX: t.clientX,
    clientY: t.clientY,
    pointerId: 9999, // stable fake id
    pointerType: "touch",
    preventDefault() {},
  });
}

onTouchMove(e) {
  if (!this._touchDragging) return;

  const t = Array.from(e.changedTouches).find(tt => tt.identifier === this._touchId);
  if (!t) return;

  e.preventDefault();

  this.handlePointerMove({
    clientX: t.clientX,
    clientY: t.clientY,
    pointerId: 9999,
    pointerType: "touch",
    preventDefault() {},
  });
}

onTouchEnd(e) {
  const t = Array.from(e.changedTouches).find(tt => tt.identifier === this._touchId);
  if (!t) return;

  e.preventDefault();

  this.handlePointerUp({
    clientX: t.clientX,
    clientY: t.clientY,
    pointerId: 9999,
    pointerType: "touch",
    preventDefault() {},
  });

  this._touchId = null;
  this._touchDragging = false;
}

  // ----------------------------
  // Canvas / init
  // ----------------------------
  resizeCanvas() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    this.canvas.width = Math.max(300, rect.width - 24);
    this.canvas.height = Math.max(200, rect.height - 24);
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
  }

  init() {
    this.setupEventListeners();
    this.animate();
    this.updateHint();
    this.syncComponentValueUI(null); // EDITED: start with disabled slider
  }

  setupEventListeners() {
    // Drag and drop from component bank
    document.addEventListener("pointermove", (e) => this.onPaletteGhostMove(e), { passive: false, capture: true });
document.addEventListener("pointerup", (e) => this.onPaletteGhostUp(e, false), { passive: false, capture: true });
document.addEventListener("pointercancel", (e) => this.onPaletteGhostUp(e, true), { passive: false, capture: true });



   document.querySelectorAll(".component-item").forEach((item) => {
  item.addEventListener("dragstart", (e) => this.handleDragStart(e));
  item.addEventListener("dragend", (e) => this.handleDragEnd(e));

  item.addEventListener(
    "pointerdown",
    (e) => {
      if (!this.isTouchLike(e)) return;
      e.preventDefault();
      e.stopPropagation();

      const type = item.dataset.type;
      const value = parseFloat(item.dataset.value || "0");
      this.startPaletteGhostDrag(e, item, type, value);
    },
    { passive: false }
  );
});




    // Canvas events
    this.canvas.addEventListener("drop", (e) => this.handleDrop(e));
    this.canvas.addEventListener("dragover", (e) => this.handleDragOver(e));
   this.canvas.addEventListener("pointerdown", e => this.handlePointerDown(e), { passive: false });
this.canvas.addEventListener("pointermove", e => this.handlePointerMove(e), { passive: false });
this.canvas.addEventListener("pointerup",   e => this.handlePointerUp(e),   { passive: false });
    this.canvas.addEventListener("pointerdown", e => this.handlePointerDown(e), { passive: false });
this.canvas.addEventListener("pointermove", e => this.handlePointerMove(e), { passive: false });
this.canvas.addEventListener("pointerup",   e => this.handlePointerUp(e),   { passive: false });

// ADD (important on iPad)
this.canvas.addEventListener("pointercancel", e => this.handlePointerUp(e), { passive: false });

// ADD: iPad fallback
this.canvas.addEventListener("touchstart", (e) => this.onTouchStart(e), { passive: false });
this.canvas.addEventListener("touchmove",  (e) => this.onTouchMove(e),  { passive: false });
this.canvas.addEventListener("touchend",   (e) => this.onTouchEnd(e),   { passive: false });
this.canvas.addEventListener("touchcancel",(e) => this.onTouchEnd(e),   { passive: false });
const rotateBtn = document.getElementById("rotate-btn");
if (rotateBtn) {
  rotateBtn.addEventListener("click", () => {
    const sel = this.getSelectedComponent();
    if (!sel) return;

    sel.orientation = sel.orientation === "horizontal" ? "vertical" : "horizontal";
    this.calculateCircuit();
  });
}


    this.canvas.addEventListener("contextmenu", (e) => this.handleRightClick(e));

    // Controls
    const bv = document.getElementById("battery-voltage");
    if (bv) {
      bv.addEventListener("input", (e) => {
        this.batteryVoltage = parseFloat(e.target.value);
        const out = document.getElementById("battery-voltage-value");
        if (out) out.textContent = `${this.batteryVoltage} V`;
        this.updateBatteryVoltages();
        this.calculateCircuit();
      });
    }


    const cv = document.getElementById("component-value");
    const cvOut = document.getElementById("component-value-display");
    if (cv) {
      cv.addEventListener("input", (e) => {
        this.componentValue = parseFloat(e.target.value);
        if (cvOut) cvOut.textContent = `${this.componentValue} Ω`;

        const sel = this.getSelectedComponent();
        if (sel && this.isValueEditable(sel)) {
          sel.value = this.componentValue;
          this.calculateCircuit();
        }
      });
    }

    const sg = document.getElementById("show-grid");
    if (sg) sg.addEventListener("change", (e) => (this.showGrid = e.target.checked));

    const sv = document.getElementById("show-values");
    if (sv) sv.addEventListener("change", (e) => (this.showValues = e.target.checked));

    const del = document.getElementById("delete-mode-btn");
    if (del) {
      del.addEventListener("click", () => {
        this.deleteMode = !this.deleteMode;
        if (this.deleteMode) {
          del.classList.add("coral-btn");
          del.classList.remove("navy-btn");
          del.textContent = "Delete Mode (ON)";
        } else {
          del.classList.add("navy-btn");
          del.classList.remove("coral-btn");
          del.textContent = "Delete Mode (OFF)";
        }
        this.canvas.classList.toggle("delete-mode", this.deleteMode);
        this.updateHint();
      });
    }

    const clear = document.getElementById("clear-btn");
    if (clear) {
      clear.addEventListener("click", () => {
        if (confirm("Clear entire circuit?")) {
          this.components = [];
          this.wires = [];
          this.lastSolve = null;
          this.selectedComponentId = null; // EDITED
          this.syncComponentValueUI(null); // EDITED
          this.calculateCircuit();
          this.updateHint();
        }
      });
    }

    const reset = document.getElementById("reset-btn");
    if (reset) reset.addEventListener("click", () => window.location.reload());
  }

  // ----------------------------
  // Selection + value editing (EDITED)
  // ----------------------------
  getSelectedComponent() {
    if (this.selectedComponentId == null) return null;
    return this.components.find((c) => c.id === this.selectedComponentId) || null;
  }

  isValueEditable(comp) {
    // resistors, variable-resistors, bulbs: yes
    // meters + battery: no (battery uses separate voltage slider)
    return comp.type === "resistor" || comp.type === "variable-resistor" || comp.type === "bulb";
  }

  syncComponentValueUI(comp) {
    const cv = document.getElementById("component-value");
    const cvOut = document.getElementById("component-value-display");
    if (!cv || !cvOut) return;

    if (!comp || !this.isValueEditable(comp)) {
      cv.disabled = true;
      cvOut.textContent = "—";
      return;
    }

    cv.disabled = false;
    cv.value = comp.value;
    this.componentValue = comp.value;
    cvOut.textContent = `${comp.value} Ω`;
  }

  // Only allow voltmeter reading once both leads actually have a wire attached
  isTerminalWired(compId, pin) {
    for (const w of this.wires) {
      if (w.a && w.a.compId === compId && w.a.pin === pin) return true;
      if (w.b && w.b.compId === compId && w.b.pin === pin) return true;
    }
    return false;
  }


  handleDragStart(e) {
    const item = e.target.closest(".component-item");
    if (!item) return;
    const type = item.dataset.type;
    const value = parseFloat(item.dataset.value || "0");
    this.draggedComponent = { type, value };
    item.classList.add("dragging");
  }

  handleDragEnd(e) {
    const item = e.target.closest(".component-item");
    if (item) item.classList.remove("dragging");
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  handleDrop(e) {
    e.preventDefault();
    if (!this.draggedComponent) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = this.snapToGrid(e.clientX - rect.left);
    const y = this.snapToGrid(e.clientY - rect.top);

    const collision = this.components.find(
      (c) => Math.abs(c.x - x) < this.gridSize && Math.abs(c.y - y) < this.gridSize
    );

    if (!collision && x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height) {
      const component = {
        id: this.nextId++,
        type: this.draggedComponent.type,
        x,
        y,
        // EDITED: uses componentValue (not "newComponentValue") for newly dropped resistive components
        value: this.draggedComponent.type === "battery" ? this.batteryVoltage : this.componentValue,
        current: 0,
        voltage: 0,
        orientation: "horizontal",
      };
      this.components.push(component);

      // EDITED: auto-select the newly dropped component and sync slider
      this.selectedComponentId = component.id;
      this.syncComponentValueUI(component);

      this.calculateCircuit();
      this.updateHint();
    }

    this.draggedComponent = null;
  }


  handleRightClick(e) {
    e.preventDefault();
    const { x, y } = this.getPointerCanvasXY(e);

    for (let i = this.components.length - 1; i >= 0; i--) {
      const comp = this.components[i];
      if (this.isPointInComponent(x, y, comp)) {
        comp.orientation = comp.orientation === "horizontal" ? "vertical" : "horizontal";
        // keep selection synced
        if (this.selectedComponentId === comp.id) this.syncComponentValueUI(comp);
        this.calculateCircuit();
        return;
      }
    }
  }

  handlePointerDown(e) {
    e.preventDefault();

this.activePointerId = e.pointerId ?? 1; // fallback

try {
  if (e.pointerId != null) this.canvas.setPointerCapture(e.pointerId);
} catch (_) {
  // iPad WebKit sometimes throws here, ignore
}

  this.canvas.setPointerCapture(e.pointerId);
  this.activePointerId = e.pointerId;
    const { x, y } = this.getPointerCanvasXY(e);
    const gx = this.snapToGrid(x);
    const gy = this.snapToGrid(y);

if (this.palettePick) {
  const collision = this.components.find(
    (c) => Math.abs(c.x - gx) < this.gridSize && Math.abs(c.y - gy) < this.gridSize
  );

  if (!collision) {
    const component = {
      id: this.nextId++,
      type: this.palettePick.type,
      x: gx,
      y: gy,
      value: this.palettePick.type === "battery" ? this.batteryVoltage : this.componentValue,
      current: 0,
      voltage: 0,
      orientation: "horizontal",
    };

    this.components.push(component);
    this.selectedComponentId = component.id;
    this.syncComponentValueUI(component);

    this.calculateCircuit();
    this.updateHint();
  }

  // If you want “single place”, clear pick after one placement:
  this.palettePick = null;
  if (this.paletteEl) this.paletteEl.classList.remove("picked");
  this.paletteEl = null;

  return; // IMPORTANT: don't start wire drawing on the same tap
}


    if (this.deleteMode) {
      // delete on click
      this.handleDeleteClick(x, y);
      return;
    }

    // Start dragging component if clicked on one (EDITED: also select it)
    for (let i = this.components.length - 1; i >= 0; i--) {
      const comp = this.components[i];
      if (this.isPointInComponent(x, y, comp)) {
        this.selectedComponentId = comp.id;
        this.syncComponentValueUI(comp);

        this.draggedCanvasComponent = comp;
        this.dragOffset = { x: x - comp.x, y: y - comp.y };
        this.canvas.style.cursor = "grabbing";
        return;
      }
    }

    // EDITED: clicking empty space deselects
    this.selectedComponentId = null;
    this.syncComponentValueUI(null);

    // Otherwise start wire drawing
    this.isDrawingWire = true;
    this.currentWirePath = [{ x: gx, y: gy }];
  }

  handlePointerMove(e) {
      // Only block if BOTH ids exist and they differ
if (this.activePointerId != null && e.pointerId != null && this.activePointerId !== e.pointerId) return;

  e.preventDefault();
    const { x, y } = this.getPointerCanvasXY(e);

    // Drag component
    if (this.draggedCanvasComponent) {
      const newX = this.snapToGrid(x - this.dragOffset.x);
      const newY = this.snapToGrid(y - this.dragOffset.y);
      this.draggedCanvasComponent.x = newX;
      this.draggedCanvasComponent.y = newY;
      return;
    }

    // Extend wire path
    if (this.isDrawingWire && this.currentWirePath.length > 0) {
      const gx = this.snapToGrid(x);
      const gy = this.snapToGrid(y);
      const last = this.currentWirePath[this.currentWirePath.length - 1];
      if (last.x !== gx || last.y !== gy) this.currentWirePath.push({ x: gx, y: gy });
      return;
    }

    this.canvas.style.cursor = this.deleteMode ? "not-allowed" : "crosshair";
  }

  handlePointerUp(e) {
     // Only block if BOTH ids exist and they differ
try {
  if (e.pointerId != null && this.canvas.releasePointerCapture) {
    this.canvas.releasePointerCapture(e.pointerId);
  }
} catch (_) {}

this.activePointerId = null;


  e.preventDefault();
  this.canvas.releasePointerCapture(e.pointerId);
  this.activePointerId = null;
    if (this.draggedCanvasComponent) {
      this.draggedCanvasComponent = null;
      this.canvas.style.cursor = "crosshair";
      this.calculateCircuit();
      return;
    }

    if (this.isDrawingWire) {
      this.isDrawingWire = false;
      if (this.currentWirePath.length >= 2) {
        this.createWireFromPath(this.currentWirePath);
      }
      this.currentWirePath = [];
    }
  }

  handleDeleteClick(x, y) {
    // delete component
    for (let i = this.components.length - 1; i >= 0; i--) {
      const comp = this.components[i];
      if (this.isPointInComponent(x, y, comp)) {
        this.components.splice(i, 1);
        // remove wires that attach to that terminal
        this.wires = this.wires.filter((w) => !this.wireTouchesComponent(w, comp.id));

        // EDITED: clear selection if deleted
        if (this.selectedComponentId === comp.id) {
          this.selectedComponentId = null;
          this.syncComponentValueUI(null);
        }

        this.calculateCircuit();
        return;
      }
    }

    // delete wire if near any segment
    for (let i = this.wires.length - 1; i >= 0; i--) {
      if (this.isPointNearWirePath(x, y, this.wires[i])) {
        this.wires.splice(i, 1);
        this.calculateCircuit();
        return;
      }
    }
  }

  // ----------------------------
  // Wiring
  // ----------------------------
  createWireFromPath(path) {
    if (!path || path.length < 2) return;

    const simplified = this.simplifyPath(path);

    const start = simplified[0];
    const end = simplified[simplified.length - 1];

    const a = this.findTerminalAtPoint(start.x, start.y);
    const b = this.findTerminalAtPoint(end.x, end.y);

    this.wires.push({
      id: this.nextId++,
      path: simplified,
      ax: start.x,
      ay: start.y,
      bx: end.x,
      by: end.y,
      a, // {compId,pin} or null
      b, // {compId,pin} or null
    });

    this.calculateCircuit();
  }

  wireTouchesComponent(w, compId) {
    return (w.a && w.a.compId === compId) || (w.b && w.b.compId === compId);
  }

  simplifyPath(path) {
    const out = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      const prev = out[out.length - 1];
      const curr = path[i];
      const next = path[i + 1];

      const sameH = prev.y === curr.y && curr.y === next.y;
      const sameV = prev.x === curr.x && curr.x === next.x;

      if (!sameH && !sameV) out.push(curr);
    }
    out.push(path[path.length - 1]);

    // Remove consecutive duplicates (can happen from snapping)
    const cleaned = [out[0]];
    for (let i = 1; i < out.length; i++) {
      const p = out[i];
      const q = cleaned[cleaned.length - 1];
      if (p.x !== q.x || p.y !== q.y) cleaned.push(p);
    }
    return cleaned;
  }

  findTerminalAtPoint(x, y) {
    const hit = 18;
    for (const comp of this.components) {
      const terminals = this.getComponentTerminals(comp);
      for (let pin = 0; pin < terminals.length; pin++) {
        const t = terminals[pin];
        const d = Math.hypot(t.x - x, t.y - y);
        if (d < hit) return { compId: comp.id, pin };
      }
    }
    return null;
  }

  isPointNearWirePath(x, y, wire) {
    const pts = wire.path || [];
    if (pts.length < 2) return false;
    const tol = 8;

    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const d = this.distPointToSegment(x, y, a.x, a.y, b.x, b.y);
      if (d < tol) return true;
    }
    return false;
  }

  distPointToSegment(px, py, x1, y1, x2, y2) {
    const vx = x2 - x1;
    const vy = y2 - y1;
    const wx = px - x1;
    const wy = py - y1;

    const c1 = vx * wx + vy * wy;
    if (c1 <= 0) return Math.hypot(px - x1, py - y1);

    const c2 = vx * vx + vy * vy;
    if (c2 <= c1) return Math.hypot(px - x2, py - y2);

    const t = c1 / c2;
    const projx = x1 + t * vx;
    const projy = y1 + t * vy;
    return Math.hypot(px - projx, py - projy);
  }

  // ----------------------------
  // Nets + Netlist
  // ----------------------------
  buildNets() {
    const uf = new UnionFind();

    // union along wire paths + attach endpoints to terminals
    // union along wire paths + attach endpoints to terminals
for (const w of this.wires) {
  const pts = w.path || [];
  if (pts.length < 2) continue;

  // Expand each segment into every grid point along it (so mid-segment junctions work)
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];

    const dx = Math.sign(b.x - a.x);
    const dy = Math.sign(b.y - a.y);

    // We expect axis-aligned segments; this also works for 45° but you don't draw those.
    const steps = Math.max(
      Math.abs((b.x - a.x) / this.gridSize),
      Math.abs((b.y - a.y) / this.gridSize)
    );

    let prevKey = `g:${a.x},${a.y}`;
    uf.find(prevKey);

    for (let s = 1; s <= steps; s++) {
      const x = a.x + dx * s * this.gridSize;
      const y = a.y + dy * s * this.gridSize;
      const key = `g:${x},${y}`;
      uf.find(key);
      uf.union(prevKey, key);
      prevKey = key;
    }
  }

  const startKey = `g:${w.ax},${w.ay}`;
  const endKey = `g:${w.bx},${w.by}`;

  if (w.a) uf.union(startKey, `t:${w.a.compId}:${w.a.pin}`);
  if (w.b) uf.union(endKey, `t:${w.b.compId}:${w.b.pin}`);
}


    // ensure every terminal exists
    for (const c of this.components) {
      uf.find(`t:${c.id}:0`);
      uf.find(`t:${c.id}:1`);
    }

const terminalsAtGrid = new Map(); // key "x,y" -> array of {compId,pin}

for (const c of this.components) {
  const terms = this.getComponentTerminals(c);

  for (let pin = 0; pin < terms.length; pin++) {
    // snap terminal positions to grid to avoid tiny pixel drift
    const gx = this.snapToGrid(terms[pin].x);
    const gy = this.snapToGrid(terms[pin].y);
    const key = `${gx},${gy}`;

    if (!terminalsAtGrid.has(key)) terminalsAtGrid.set(key, []);
    terminalsAtGrid.get(key).push({ compId: c.id, pin });
  }
}

// Union all terminals that share a grid point
for (const [key, list] of terminalsAtGrid.entries()) {
  if (list.length < 2) continue;
  const first = list[0];
  for (let i = 1; i < list.length; i++) {
    const t = list[i];
    uf.union(`t:${first.compId}:${first.pin}`, `t:${t.compId}:${t.pin}`);
  }
}


    // map uf roots to node indices
    const nodeOfRoot = new Map();
    let nextNode = 0;

    const getNodeByKey = (key) => {
      const r = uf.find(key);
      if (!nodeOfRoot.has(r)) nodeOfRoot.set(r, nextNode++);
      return nodeOfRoot.get(r);
    };

    const termNode = (compId, pin) => getNodeByKey(`t:${compId}:${pin}`);

    return { termNode, getNodeByKey, uf, nodeCount: nextNode, nodeOfRoot };
  }

  buildNetlist(nets) {
    const els = [];

    for (const c of this.components) {
      const n1 = nets.termNode(c.id, 0);
      const n2 = nets.termNode(c.id, 1);

      if (c.type === "battery") {
        els.push({ kind: "V", id: c.id, nPlus: n1, nMinus: n2, value: c.value });
      } else if (c.type === "voltmeter") {
        els.push({ kind: "VM", id: c.id, n1, n2 });
      } else if (c.type === "ammeter") {
        els.push({ kind: "R", id: c.id, n1, n2, value: 1e-6 });
      } else if (c.type === "resistor" || c.type === "variable-resistor" || c.type === "bulb") {
        els.push({ kind: "R", id: c.id, n1, n2, value: Math.max(1e-6, c.value) });
      }
    }

    return els;
  }

  filterToBatterySubcircuit(elements, groundNode) {
    const adj = new Map();
    const addEdge = (a, b) => {
      if (!adj.has(a)) adj.set(a, []);
      adj.get(a).push(b);
    };

    const conductive = elements.filter((e) => e.kind === "R" || e.kind === "V");
    for (const e of conductive) {
      if (e.kind === "R") {
        addEdge(e.n1, e.n2);
        addEdge(e.n2, e.n1);
      } else if (e.kind === "V") {
        addEdge(e.nPlus, e.nMinus);
        addEdge(e.nMinus, e.nPlus);
      }
    }

    const firstV = elements.find((e) => e.kind === "V");
    if (!firstV) return elements;

    const startNodes = [firstV.nPlus, firstV.nMinus, groundNode];

    const seen = new Set();
    const q = [];
    for (const s of startNodes) {
      if (s == null) continue;
      if (!seen.has(s)) {
        seen.add(s);
        q.push(s);
      }
    }

    while (q.length) {
      const u = q.shift();
      const nbrs = adj.get(u) || [];
      for (const v of nbrs) {
        if (!seen.has(v)) {
          seen.add(v);
          q.push(v);
        }
      }
    }

    const kept = [];
    for (const e of elements) {
      if (e.kind === "R") {
        if (seen.has(e.n1) && seen.has(e.n2)) kept.push(e);
      } else if (e.kind === "V") {
        if (seen.has(e.nPlus) && seen.has(e.nMinus)) kept.push(e);
      } else {
        kept.push(e); // VM doesn't affect solve
      }
    }

    return kept;
  }

  // ----------------------------
  // Solver (MNA)
  // ----------------------------
  calculateCircuit() {
    if (this.isDrawingWire) return;

    // reset display values
    this.components.forEach((c) => {
      c.current = 0;
      c.voltage = 0;
    });
    this.lastSolve = null;

    const battery = this.components.find((c) => c.type === "battery");
    if (!battery) return;

    const nets = this.buildNets();
    let elements = this.buildNetlist(nets);

    const vSources = elements.filter((e) => e.kind === "V");
    if (vSources.length === 0) return;

    const ground = vSources[0].nMinus;

    elements = this.filterToBatterySubcircuit(elements, ground);

    const sol = this.solveMNA(elements, ground);
    if (!sol) return;

    this.lastSolve = {
      nodeV: sol.nodeV,
      branchIById: sol.branchIById,
      termNode: (compId, pin) => nets.termNode(compId, pin),
      ground,
    };

    // Write back to components
    for (const c of this.components) {
      const n1 = nets.termNode(c.id, 0);
      const n2 = nets.termNode(c.id, 1);

      const v1safe = sol.nodeV[n1] ?? 0;
      const v2safe = sol.nodeV[n2] ?? 0;
      const dvSafe = v1safe - v2safe;

      if (c.type === "voltmeter") {
        // EDITED: only read once BOTH leads have at least one wire attached and are across different nodes
        const lead1 = this.isTerminalWired(c.id, 0);
        const lead2 = this.isTerminalWired(c.id, 1);

        const v1 = sol.nodeV[n1];
        const v2 = sol.nodeV[n2];

        const bothSolved = v1 !== undefined && v2 !== undefined;
        const differentNodes = n1 !== n2;

        c.voltage = lead1 && lead2 && bothSolved && differentNodes ? Math.abs(v1 - v2) : 0;
        c.current = 0;
      } else if (c.type === "battery") {
        c.voltage = c.value;
        c.current = Math.abs(sol.branchIById.get(c.id) ?? 0);
     } else if (c.type === "ammeter") {
  c.voltage = Math.abs(dvSafe);

  const I = Math.abs(sol.branchIById.get(c.id) ?? 0);


  const MAX_A = 5;
  c.current = Math.min(I, MAX_A);

  // optional flag if you want to show a warning text later
  c._clamped = I > MAX_A;

} else {
  c.voltage = Math.abs(dvSafe);
  c.current = Math.abs(sol.branchIById.get(c.id) ?? 0);
}

    }
  }

  solveMNA(elements, groundNode) {
    const allNodes = new Set();

    for (const e of elements) {
      if (e.kind === "R") {
        allNodes.add(e.n1);
        allNodes.add(e.n2);
      } else if (e.kind === "V") {
        allNodes.add(e.nPlus);
        allNodes.add(e.nMinus);
      }
      // IMPORTANT: ignore VM here
    }

    const nodes = Array.from(allNodes.values()).sort((a, b) => a - b);
    const mapNodeToVar = new Map();
    let nVars = 0;

    for (const n of nodes) {
      if (n === groundNode) continue;
      mapNodeToVar.set(n, nVars++);
    }

    const vSources = elements.filter((e) => e.kind === "V");
    const m = vSources.length;

    const N = nVars + m;
    if (N === 0) return null;

    const A = Array.from({ length: N }, () => new Float64Array(N));
    const z = new Float64Array(N);

    const nodeVar = (node) => mapNodeToVar.get(node);

    // Stamp resistors
    for (const e of elements) {
      if (e.kind !== "R") continue;
      const g = 1 / e.value;

      const aIsG = e.n1 === groundNode;
      const bIsG = e.n2 === groundNode;

      if (!aIsG) A[nodeVar(e.n1)][nodeVar(e.n1)] += g;
      if (!bIsG) A[nodeVar(e.n2)][nodeVar(e.n2)] += g;

      if (!aIsG && !bIsG) {
        A[nodeVar(e.n1)][nodeVar(e.n2)] -= g;
        A[nodeVar(e.n2)][nodeVar(e.n1)] -= g;
      }
    }

    // Stamp voltage sources
    vSources.forEach((vs, k) => {
      const row = nVars + k;

      const pG = vs.nPlus === groundNode;
      const nG = vs.nMinus === groundNode;

      if (!pG) {
        const vp = nodeVar(vs.nPlus);
        A[vp][row] += 1;
        A[row][vp] += 1;
      }
      if (!nG) {
        const vn = nodeVar(vs.nMinus);
        A[vn][row] -= 1;
        A[row][vn] -= 1;
      }

      z[row] = vs.value;
    });

    const x = this.solveLinearSystem(A, z);
    if (!x) return null;

    const nodeV = [];
    const maxNode = Math.max(...nodes, groundNode);
    for (let i = 0; i <= maxNode; i++) nodeV[i] = 0;
    nodeV[groundNode] = 0;

    for (const n of nodes) {
      if (n === groundNode) continue;
      nodeV[n] = x[nodeVar(n)];
    }

    const branchIById = new Map();

    for (const e of elements) {
      if (e.kind === "R") {
        const v1 = nodeV[e.n1] ?? 0;
        const v2 = nodeV[e.n2] ?? 0;
        const I = (v1 - v2) / e.value;
        branchIById.set(e.id, I);
      }
    }

    vSources.forEach((vs, k) => {
      const I = x[nVars + k];
      branchIById.set(vs.id, I);
    });

    return { nodeV, branchIById };
  }

  solveLinearSystem(A, z) {
    const N = z.length;

    const M = A.map((row) => Float64Array.from(row));
    const b = Float64Array.from(z);

    for (let col = 0; col < N; col++) {
      let pivotRow = col;
      let pivotVal = Math.abs(M[col][col]);
      for (let r = col + 1; r < N; r++) {
        const v = Math.abs(M[r][col]);
        if (v > pivotVal) {
          pivotVal = v;
          pivotRow = r;
        }
      }

      if (pivotVal < 1e-12) return null;

      if (pivotRow !== col) {
        const tmp = M[col];
        M[col] = M[pivotRow];
        M[pivotRow] = tmp;

        const tb = b[col];
        b[col] = b[pivotRow];
        b[pivotRow] = tb;
      }

      const p = M[col][col];
      for (let c = col; c < N; c++) M[col][c] /= p;
      b[col] /= p;

      for (let r = col + 1; r < N; r++) {
        const f = M[r][col];
        if (Math.abs(f) < 1e-15) continue;
        for (let c = col; c < N; c++) M[r][c] -= f * M[col][c];
        b[r] -= f * b[col];
      }
    }

    const x = new Float64Array(N);
    for (let r = N - 1; r >= 0; r--) {
      let s = b[r];
      for (let c = r + 1; c < N; c++) s -= M[r][c] * x[c];
      x[r] = s;
    }
    return x;
  }

  // ----------------------------
  // Helpers
  // ----------------------------
  updateBatteryVoltages() {
    for (const c of this.components) {
      if (c.type === "battery") c.value = this.batteryVoltage;
    }
  }

  snapToGrid(v) {
    return Math.round(v / this.gridSize) * this.gridSize;
  }

  getPointerCanvasXY(e) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  isPointInComponent(x, y, comp) {
    const size = (window.matchMedia("(hover: none)").matches ? 90 : 60);

    return (
      x >= comp.x - size / 2 &&
      x <= comp.x + size / 2 &&
      y >= comp.y - size / 2 &&
      y <= comp.y + size / 2
    );
  }

  getComponentTerminals(comp) {
    const size = 40;
    if (comp.orientation === "horizontal") {
      return [
        { x: comp.x - size, y: comp.y, label: "pin0" },
        { x: comp.x + size, y: comp.y, label: "pin1" },
      ];
    }
    return [
      { x: comp.x, y: comp.y - size, label: "pin0" },
      { x: comp.x, y: comp.y + size, label: "pin1" },
    ];
  }

  updateHint() {
    const hint = document.getElementById("canvas-hint");
    if (!hint) return;

    if (this.components.length === 0)
      hint.textContent = "Drag components from the panel to start building your circuit";
    else if (this.deleteMode)
      hint.textContent = "Click on components or wires to delete them";
    else hint.textContent = "Click and drag to draw wires between component terminals (snaps to grid)";
  }

  // ----------------------------
  // Draw
  // ----------------------------
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.showGrid) this.drawGrid();

    for (const w of this.wires) this.drawWire(w);

    if (this.isDrawingWire && this.currentWirePath.length > 0) {
      const ctx = this.ctx;
      ctx.strokeStyle = "#3498db";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(this.currentWirePath[0].x, this.currentWirePath[0].y);
      for (let i = 1; i < this.currentWirePath.length; i++) ctx.lineTo(this.currentWirePath[i].x, this.currentWirePath[i].y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (const c of this.components) this.drawComponent(c);
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 1;

    for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }
  }

  drawWire(wire) {
    const ctx = this.ctx;
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    const pts = wire.path || [];
    if (pts.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      ctx.fillStyle = "#3498db";
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, 5, 0, Math.PI * 2);
      ctx.fill();

      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawComponent(comp) {
    const ctx = this.ctx;
    const size = 40;

    // EDITED: highlight selected component (smaller box so terminals are outside)
    if (comp.id === this.selectedComponentId) {
      ctx.save();
      ctx.translate(comp.x, comp.y);
      ctx.strokeStyle = "#f1c40f";
      ctx.lineWidth = 3;
      // Smaller highlight box (30x30) so terminals at ±40px are clearly outside
      ctx.strokeRect(-30, -30, 60, 60);
      ctx.restore();
    }

    ctx.save();
    ctx.translate(comp.x, comp.y);

    if (comp.orientation === "vertical") ctx.rotate(Math.PI / 2);

    ctx.strokeStyle = "#2c3e50";
    ctx.fillStyle = "#2c3e50";
    ctx.lineWidth = 2;

    switch (comp.type) {
      case "battery":
        this.drawBattery(ctx, size);
        break;
      case "resistor":
        this.drawResistor(ctx, size);
        break;
      case "variable-resistor":
        this.drawVariableResistor(ctx, size);
        break;
      case "bulb":
        this.drawBulb(ctx, size, comp.current);
        break;
      case "ammeter":
        this.drawAmmeter(ctx, size);
        break;
      case "voltmeter":
        this.drawVoltmeter(ctx, size);
        break;
    }

    ctx.restore();

    ctx.save();
    ctx.translate(comp.x, comp.y);
    const terminals = this.getComponentTerminals(comp);
    for (const t of terminals) {
      ctx.fillStyle = "#3498db";
      ctx.beginPath();
      ctx.arc(t.x - comp.x, t.y - comp.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (this.showValues) this.drawValues(comp, size);
  }

  drawValues(comp, size) {
  const ctx = this.ctx;
  ctx.save();
  ctx.translate(comp.x, comp.y);
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const box = (text, ox, oy, color = "#2c3e50") => {
    const w = ctx.measureText(text).width;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(ox - w / 2 - 4, oy - 11, w + 8, 22);
    ctx.fillStyle = color;
    ctx.fillText(text, ox, oy);
  };

  // Tuning distances
  const above = -(size + 2);   // closer than before (was -size - 13)
  const below = size + 2;     // meters
  const left  = -(size + 30);  // rotated meters

  if (comp.type === "ammeter") {
    const x = comp.orientation === "vertical" ? left : 0;
    const y = comp.orientation === "vertical" ? 0 : below;
    box(`${comp.current.toFixed(2)} A`, x, y, "#1abc9c");

  } else if (comp.type === "voltmeter") {
    const x = comp.orientation === "vertical" ? left : 0;
    const y = comp.orientation === "vertical" ? 0 : below;
    box(`${comp.voltage.toFixed(2)} V`, x, y, "#1abc9c");

  } else if (comp.type === "battery") {
    box(`${comp.value} V`, 0, above);

  } else {
    box(`${comp.value} Ω`, 0, above);
  }

  ctx.restore();
}



  drawBattery(ctx, size) {
  // Terminal/wire ends for the symbol
  const leftEnd = -size;
  const rightEnd = size;

  // Bring plates closer together
  const gap = size * 0.25;     // smaller gap between plates
  const xNeg = -gap;           // short plate (negative) x
  const xPos = gap;            // long plate (positive) x

  // Plate lengths
  const shortHalf = size * 0.28;
  const longHalf  = size * 0.50;

  // Legs: from ends to plates (these now connect perfectly)
  ctx.beginPath();
  ctx.moveTo(leftEnd, 0);
  ctx.lineTo(xNeg, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xPos, 0);
  ctx.lineTo(rightEnd, 0);
  ctx.stroke();

  // Plates
  // Short plate = negative (left)
  ctx.beginPath();
  ctx.moveTo(xNeg, -shortHalf);
  ctx.lineTo(xNeg, shortHalf);
  ctx.stroke();

  // Long plate = positive (right)
  ctx.beginPath();
  ctx.moveTo(xPos, -longHalf);
  ctx.lineTo(xPos, longHalf);
  ctx.stroke();

  // Signs (positioned above each plate)
  ctx.save();
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#3498db";
  ctx.fillText("-", xNeg, -longHalf - 12);

  ctx.fillStyle = "#e74c3c";
  ctx.fillText("+", xPos, -longHalf - 12);

  ctx.restore();
}



  drawResistor(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size / 2, 0);
    ctx.stroke();

    ctx.strokeRect(-size / 2, -size / 4, size, size / 2);

    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();
  }

  drawVariableResistor(ctx, size) {
  // Base resistor
  this.drawResistor(ctx, size);

  // Resistor body bounds (match drawResistor)
  const left = -size / 2;
  const right = size / 2;
  const top = -size / 4;
  const bottom = size / 4;

  // Arrow: diagonal THROUGH the resistor body
  const ax1 = left + size * 0.15;
  const ay1 = bottom + size * 0.25;   // start slightly below body
  const ax2 = right - size * 0.15;
  const ay2 = top - size * 0.25;      // end slightly above body

  ctx.beginPath();
  ctx.moveTo(ax1, ay1);
  ctx.lineTo(ax2, ay2);
  ctx.stroke();

  // Arrowhead at the "top-right" end (ax2, ay2)
  const headLen = 8;
  const angle = Math.atan2(ay2 - ay1, ax2 - ax1);

  ctx.beginPath();
  ctx.moveTo(ax2, ay2);
  ctx.lineTo(
    ax2 - headLen * Math.cos(angle - Math.PI / 6),
    ay2 - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(ax2, ay2);
  ctx.lineTo(
    ax2 - headLen * Math.cos(angle + Math.PI / 6),
    ay2 - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}


  drawBulb(ctx, size, current) {
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size / 2, 0);
    ctx.stroke();

    if (current > 0) {
      const brightness = Math.min(current / 0.5, 1);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2 + 10);
      gradient.addColorStop(0, `rgba(255,220,100,${brightness * 0.8})`);
      gradient.addColorStop(0.6, `rgba(255,200,50,${brightness * 0.4})`);
      gradient.addColorStop(1, `rgba(255,180,0,0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size / 2 + 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,255,200,${brightness * 0.6})`;
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-size / 4, -size / 4);
    ctx.lineTo(size / 4, size / 4);
    ctx.moveTo(size / 4, -size / 4);
    ctx.lineTo(-size / 4, size / 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();
  }

  drawAmmeter(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size / 2, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", 0, 0);

    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();
  }

  drawVoltmeter(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size / 2, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("V", 0, 0);

    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();
  }

  animate() {
    this.animationFrame = (this.animationFrame + 0.5) % 20;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new CircuitBuilder();
});
