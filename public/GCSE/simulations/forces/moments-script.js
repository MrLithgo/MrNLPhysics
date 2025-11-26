// DOM elements
const mass1Slider = document.getElementById('mass1');
const mass2Slider = document.getElementById('mass2');
const velocity1Slider = document.getElementById('velocity1Input');
const velocity2Slider = document.getElementById('velocity2Input');
const mass1Value = document.getElementById('mass1Display');
const mass2Value = document.getElementById('mass2Display');
const velocity1Display = document.getElementById('velocity1Display');
const velocity2Display = document.getElementById('velocity2Display');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const captureBtn = document.getElementById('captureBtn');
const clearTableBtn = document.getElementById('clearTableBtn');
const downloadBtn = document.getElementById('downloadBtn');
const checkAnswersBtn = document.getElementById('checkAnswersBtn');
const trolley1 = document.getElementById('trolley1');
const trolley2 = document.getElementById('trolley2');
const velocity1Indicator = document.getElementById('velocity1Indicator');
const velocity2Indicator = document.getElementById('velocity2Indicator');
const velocity1Value = document.getElementById('velocity1Value');
const velocity2Value = document.getElementById('velocity2Value');
const velocity1Arrow = document.getElementById('velocity1Arrow');
const velocity2Arrow = document.getElementById('velocity2Arrow');
const beforeTableBody = document.getElementById('beforeTableBody');
const afterTableBody = document.getElementById('afterTableBody');
const edgeNotification = document.getElementById('edgeNotification');

// Simulation variables
let simulationRunning = false;
let animationId;
let simulationTime = 0;
let collisionOccurred = false;
let trackWidth;
let resultCount = 0;
let initialV1, initialV2; // Store initial velocities for results table
let edgeReached = false;

// Physics variables
let m1, m2, v1, v2;
let x1, x2;
let initialMomentum1, initialMomentum2, initialMomentumTotal;
let currentMomentum1, currentMomentum2, currentMomentumTotal;

// Store post-collision velocities before any edge detection
let postCollisionV1, postCollisionV2;

// Constants
const TROLLEY_WIDTH = 80; // Increased trolley width
const PIXELS_PER_METER = 80;
const TIME_SCALE = 0.02;
const MAX_ARROW_WIDTH = 100; // Maximum width for velocity arrows
const ARROW_SCALE = 10; // Scale factor for arrow width
const TOLERANCE = 0.01; // Tolerance for 2 decimal place validation

// Helper function to round to 2 decimal places
function roundToTwo(num) {
    return Math.round(num * 100) / 100;
}

// Helper function to round to 1 decimal place
function roundToOne(num) {
    return Math.round(num * 10) / 10;
}

// Show toast message with consistent styling
function showToast(message, type = 'info') {
    // Create unique toast IDs for different message types
    const toastId = `toast-${type}`;
    
    // Remove existing toast of the same type
    const existingToast = document.getElementById(toastId);
    if (existingToast) {
        document.body.removeChild(existingToast);
    }
    
    // Create new toast element
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'edge-notification';
    toast.style.cssText = `
        position: fixed;
        top: ${type === 'score' ? '20%' : '50%'};
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(44, 62, 80, 0.95);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        text-align: center;
        max-width: 80%;
        white-space: pre-line;
        line-height: 1.4;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Fade in
    setTimeout(() => {
        toast.style.opacity = "1";
    }, 10);
    
    // Set timeout based on message type
    const timeout = type === 'score' ? 5000 : 3000;
    
    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, timeout);
}

// Update display values
function updateDisplayValues() {
    mass1Value.textContent = `${mass1Slider.value} kg`;
    mass2Value.textContent = `${mass2Slider.value} kg`;
    velocity1Display.textContent = `${velocity1Slider.value} m/s`;
    velocity2Display.textContent = `${velocity2Slider.value} m/s`;
    
    // Update velocity indicators
    updateVelocityIndicators(parseFloat(velocity1Slider.value), parseFloat(velocity2Slider.value));
}

// Update velocity indicators
function updateVelocityIndicators(v1, v2) {
    // Update text
    velocity1Value.textContent = `${v1.toFixed(1)} m/s`;
    velocity2Value.textContent = `${v2.toFixed(1)} m/s`;
    
    // Update arrows
    const v1Abs = Math.abs(v1);
    const v2Abs = Math.abs(v2);
    
    // Set arrow widths (capped at MAX_ARROW_WIDTH)
    const arrow1Width = Math.min(v1Abs * ARROW_SCALE, MAX_ARROW_WIDTH);
    const arrow2Width = Math.min(v2Abs * ARROW_SCALE, MAX_ARROW_WIDTH);
    
    velocity1Arrow.style.width = `${arrow1Width}px`;
    velocity2Arrow.style.width = `${arrow2Width}px`;
    
    // Set arrow directions and colors
    if (v1 < 0) {
        velocity1Arrow.style.marginLeft = `${arrow1Width}px`;
        velocity1Arrow.style.transform = 'scaleX(-1)';
        velocity1Arrow.style.backgroundColor = '#E74C3C';
    } else {
        velocity1Arrow.style.marginLeft = '0';
        velocity1Arrow.style.transform = 'scaleX(1)';
        velocity1Arrow.style.backgroundColor = '#E74C3C';
    }
    
    if (v2 < 0) {
        velocity2Arrow.style.marginLeft = `${arrow2Width}px`;
        velocity2Arrow.style.transform = 'scaleX(-1)';
        velocity2Arrow.style.backgroundColor = '#1ABC9C';
    } else {
        velocity2Arrow.style.marginLeft = '0';
        velocity2Arrow.style.transform = 'scaleX(1)';
        velocity2Arrow.style.backgroundColor = '#1ABC9C';
    }
}

// Initialize sliders
mass1Slider.addEventListener('input', updateDisplayValues);
mass2Slider.addEventListener('input', updateDisplayValues);
velocity1Slider.addEventListener('input', updateDisplayValues);
velocity2Slider.addEventListener('input', updateDisplayValues);
updateDisplayValues();

// Calculate momentum
function calculateMomentum() {
    // Calculate individual and total momentum
    currentMomentum1 = m1 * v1;
    currentMomentum2 = m2 * v2;
    currentMomentumTotal = currentMomentum1 + currentMomentum2;
    
    return {
        momentum1: currentMomentum1,
        momentum2: currentMomentum2,
        momentumTotal: currentMomentumTotal
    };
}

// Check for collision
function checkCollision() {
    // Convert positions to the same reference frame as the visual elements
    const trolley1Right = x1 * PIXELS_PER_METER + TROLLEY_WIDTH / 2;
    const trolley2Left = x2 * PIXELS_PER_METER - TROLLEY_WIDTH / 2;
    
    if (trolley1Right >= trolley2Left && !collisionOccurred) {
        collisionOccurred = true;
        handleCollision();
        
        // Store post-collision velocities
        postCollisionV1 = v1;
        postCollisionV2 = v2;
    }
}

// Handle collision physics
function handleCollision() {
    const collisionType = document.querySelector('input[name="collisionType"]:checked').value;
    
    if (collisionType === 'elastic') {
        // Elastic collision formulas - momentum and kinetic energy are both conserved
        const v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
        const v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
        
        v1 = v1Final;
        v2 = v2Final;
    } 
    else if (collisionType === 'inelastic') {
        // Partially inelastic collision (coefficient of restitution = 0.5)
        // Momentum is conserved, but some kinetic energy is lost
        const e = 0.5; // coefficient of restitution
        
        // These formulas ensure momentum conservation
        const v1Final = (m1 * v1 + m2 * v2 - m2 * e * (v1 - v2)) / (m1 + m2);
        const v2Final = (m1 * v1 + m2 * v2 + m1 * e * (v1 - v2)) / (m1 + m2);
        
        v1 = v1Final;
        v2 = v2Final;
    }
    else if (collisionType === 'perfectlyInelastic') {
        // Perfectly inelastic collision (objects stick together)
        // Momentum is conserved, but maximum kinetic energy is lost
        const vFinal = (m1 * v1 + m2 * v2) / (m1 + m2);
        v1 = vFinal;
        v2 = vFinal;
        
        // Make trolleys visually stick together
        trolley1.style.transition = "transform 0.3s ease";
        trolley2.style.transition = "transform 0.3s ease";
    }
    
    // Update velocity indicators after collision
    updateVelocityIndicators(v1, v2);
}

// Show edge notification
function showEdgeNotification() {
    edgeNotification.textContent = "Trolley reached edge! Capture results now.";
    edgeNotification.style.opacity = "1";
    setTimeout(() => {
        edgeNotification.style.opacity = "0";
    }, 3000);
}

// Update trolley positions
function updatePositions(deltaTime) {
    // Update positions based on velocities
    x1 += v1 * deltaTime;
    x2 += v2 * deltaTime;
    
    // Enforce boundaries
    const minX = TROLLEY_WIDTH / 2 / PIXELS_PER_METER;
    const maxX = trackWidth / PIXELS_PER_METER - TROLLEY_WIDTH / 2 / PIXELS_PER_METER;
    
    let boundaryReached = false;
    
    // Check boundaries for trolley 1
    if (x1 < minX) {
        x1 = minX;
        boundaryReached = true;
        // Don't set v1 to 0 here, just stop the visual movement
    }
    
    // Check boundaries for trolley 2
    if (x2 > maxX) {
        x2 = maxX;
        boundaryReached = true;
        // Don't set v2 to 0 here, just stop the visual movement
    }
    
    // Update visual positions
    trolley1.style.left = `${x1 * PIXELS_PER_METER}px`;
    trolley2.style.left = `${x2 * PIXELS_PER_METER}px`;
    
    // Update velocity indicator positions
    velocity1Indicator.style.left = `${x1 * PIXELS_PER_METER}px`;
    velocity2Indicator.style.left = `${x2 * PIXELS_PER_METER}px`;
    
    // If a boundary was reached, pause the simulation and show notification
    if (boundaryReached && !edgeReached) {
        edgeReached = true;
        showEdgeNotification();
        pauseSimulation();
        
        // We'll keep the velocity indicators showing the actual velocities
        // even though the trolleys have stopped moving visually
    }
}

// Pause simulation
function pauseSimulation() {
    cancelAnimationFrame(animationId);
    // Don't reset simulationRunning so we know a simulation is in progress but paused
}

// Animation loop
function animate(timestamp) {
    if (!simulationRunning) return;
    
    // Calculate time delta
   const deltaTime = TIME_SCALE;
   simulationTime += deltaTime;
    
    // Check for collision
    checkCollision();
    
    // Update positions
    updatePositions(deltaTime);
    
    // Update momentum display
    calculateMomentum();
    
    // Continue animation if not paused
    if (simulationRunning && !edgeReached) {
        animationId = requestAnimationFrame(animate);
    }
}

// Start simulation
startBtn.addEventListener('click', () => {
    if (simulationRunning) return;
    
    // Reset simulation state
    simulationRunning = true;
    simulationTime = 0;
    collisionOccurred = false;
    edgeReached = false;
    postCollisionV1 = null;
    postCollisionV2 = null;
    
    // Get track width
    trackWidth = document.querySelector('.track').offsetWidth;
    
    // Get physics parameters
    m1 = parseFloat(mass1Slider.value);
    m2 = parseFloat(mass2Slider.value);
    v1 = parseFloat(velocity1Slider.value);
    v2 = parseFloat(velocity2Slider.value);
    
    // Store initial velocities for results table
    initialV1 = v1;
    initialV2 = v2;
    
    // Set initial positions (in meters)
    x1 = trackWidth / PIXELS_PER_METER * 0.2;
    x2 = trackWidth / PIXELS_PER_METER * 0.8;
    
    // Reset trolley styles
    trolley1.style.transition = "none";
    trolley2.style.transition = "none";
    
    // Update initial positions
    trolley1.style.left = `${x1 * PIXELS_PER_METER}px`;
    trolley2.style.left = `${x2 * PIXELS_PER_METER}px`;
    velocity1Indicator.style.left = `${x1 * PIXELS_PER_METER}px`;
    velocity2Indicator.style.left = `${x2 * PIXELS_PER_METER}px`;
    
    // Update velocity indicators
    updateVelocityIndicators(v1, v2);
    
    // Hide edge notification
    edgeNotification.style.opacity = "0";
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    
    // Disable inputs during simulation
    mass1Slider.disabled = true;
    mass2Slider.disabled = true;
    velocity1Slider.disabled = true;
    velocity2Slider.disabled = true;
    document.querySelectorAll('input[name="collisionType"]').forEach(input => {
        input.disabled = true;
    });
    
    startBtn.disabled = true;
    startBtn.style.opacity = "0.7";
});

// Reset simulation
resetBtn.addEventListener('click', () => {
    // Stop animation
    cancelAnimationFrame(animationId);
    simulationRunning = false;
    edgeReached = false;
    
    // Reset trolley positions
    trolley1.style.left = '20%';
    trolley2.style.left = '80%';
    trolley1.style.transition = "none";
    trolley2.style.transition = "none";
    
    // Reset velocity indicator positions
    velocity1Indicator.style.left = '20%';
    velocity2Indicator.style.left = '80%';
    
    // Reset velocity indicators to initial values
    updateVelocityIndicators(parseFloat(velocity1Slider.value), parseFloat(velocity2Slider.value));
    
    // Reset simulation time
    simulationTime = 0;
    
    // Hide edge notification
    edgeNotification.style.opacity = "0";
    
    // Enable inputs
    mass1Slider.disabled = false;
    mass2Slider.disabled = false;
    velocity1Slider.disabled = false;
    velocity2Slider.disabled = false;
    document.querySelectorAll('input[name="collisionType"]').forEach(input => {
        input.disabled = false;
    });
    
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
});

// Capture results - BACK TO 2 DECIMAL PLACES
captureBtn.addEventListener('click', () => {
    if (!collisionOccurred && simulationRunning && !edgeReached) {
        showToast("No collision has occurred yet. Wait for the trolleys to collide before capturing results.", 'warning');
        return;
    }
    
    if (!simulationRunning && !collisionOccurred && !edgeReached) {
        showToast("Please run a simulation first.", 'warning');
        return;
    }
    
    // Remove empty rows if they exist
    const emptyRowBefore = document.getElementById('emptyRowBefore');
    if (emptyRowBefore) {
        emptyRowBefore.remove();
    }
    
    const emptyRowAfter = document.getElementById('emptyRowAfter');
    if (emptyRowAfter) {
        emptyRowAfter.remove();
    }
    
    // Increment result count
    resultCount++;
    
    // Get current values
    const collisionType = document.querySelector('input[name="collisionType"]:checked').value;
    
    // Format collision type for display
    let collisionTypeDisplay = collisionType;
    if (collisionType === 'elastic') {
        collisionTypeDisplay = 'Elastic';
    } else if (collisionType === 'inelastic') {
        collisionTypeDisplay = 'Inelastic (e=0.5)';
    } else if (collisionType === 'perfectlyInelastic') {
        collisionTypeDisplay = 'Perfectly Inelastic';
    }
    
    // Calculate exact values with 2 decimal places
    const displayInitialV1 = roundToTwo(initialV1);
    const displayInitialV2 = roundToTwo(initialV2);
    const displayInitialMomentum1 = roundToTwo(m1 * initialV1);
    const displayInitialMomentum2 = roundToTwo(m2 * initialV2);
    const displayInitialMomentumTotal = roundToTwo(m1 * initialV1 + m2 * initialV2);
    
    // Use post-collision velocities if available, otherwise use current velocities
    const finalV1 = postCollisionV1 !== null ? postCollisionV1 : v1;
    const finalV2 = postCollisionV2 !== null ? postCollisionV2 : v2;
    
    // Calculate exact values with 2 decimal places
    const displayFinalV1 = roundToTwo(finalV1);
    const displayFinalV2 = roundToTwo(finalV2);
    const displayFinalP1 = roundToTwo(m1 * finalV1);
    const displayFinalP2 = roundToTwo(m2 * finalV2);
    const displayFinalPTotal = roundToTwo(m1 * finalV1 + m2 * finalV2);
    
    // Create new row for "Before" table
    const beforeRow = document.createElement('tr');
    beforeRow.innerHTML = `
        <td>${resultCount}</td>
        <td>${collisionTypeDisplay}</td>
        <td class="trolley1-bg">${m1}</td>
        <td class="trolley1-bg">${displayInitialV1.toFixed(2)}</td>
        <td class="trolley1-bg">
            <input type="number" step="0.01" placeholder="Calculate..." class="student-input momentum-before" data-correct="${displayInitialMomentum1.toFixed(2)}">
        </td>
        <td class="trolley2-bg">${m2}</td>
        <td class="trolley2-bg">${displayInitialV2.toFixed(2)}</td>
        <td class="trolley2-bg">
            <input type="number" step="0.01" placeholder="Calculate..." class="student-input momentum-before" data-correct="${displayInitialMomentum2.toFixed(2)}">
        </td>
        <td>
            <input type="number" step="0.01" placeholder="Calculate..." class="student-input total-momentum-before" data-correct="${displayInitialMomentumTotal.toFixed(2)}">
        </td>
    `;
    
    // Create new row for "After" table
    const afterRow = document.createElement('tr');
    afterRow.innerHTML = `
        <td>${resultCount}</td>
        <td>${collisionTypeDisplay}</td>
        <td class="trolley1-bg">${m1}</td>
        <td class="trolley1-bg">${displayFinalV1.toFixed(2)}</td>
        <td class="trolley1-bg">
            <input type="number" step="0.01" placeholder="Calculate..." class="student-input momentum-after" data-correct="${displayFinalP1.toFixed(2)}">
        </td>
        <td class="trolley2-bg">${m2}</td>
        <td class="trolley2-bg">${displayFinalV2.toFixed(2)}</td>
        <td class="trolley2-bg">
            <input type="number" step="0.01" placeholder="Calculate..." class="student-input momentum-after" data-correct="${displayFinalP2.toFixed(2)}">
        </td>
        <td>
            <input type="number" step="0.01" placeholder="Calculate..." class="student-input total-momentum-after" data-correct="${displayFinalPTotal.toFixed(2)}">
        </td>
        <td>
            <input type="text" placeholder="Add notes..." class="notes-input">
        </td>
    `;
    
    // Add rows to tables
    beforeTableBody.appendChild(beforeRow);
    afterTableBody.appendChild(afterRow);
    
    // Highlight the new rows briefly
    beforeRow.style.backgroundColor = 'rgba(26, 188, 156, 0.1)';
    afterRow.style.backgroundColor = 'rgba(26, 188, 156, 0.1)';
    setTimeout(() => {
        beforeRow.style.backgroundColor = '';
        afterRow.style.backgroundColor = '';
    }, 1000);
    
    // Add tooltips with formulas to help students
    const inputs = document.querySelectorAll('.student-input');
    inputs.forEach(input => {
        if (!input.parentNode.querySelector('.tooltip')) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            
            const tooltipText = document.createElement('span');
            tooltipText.className = 'tooltiptext';
            tooltipText.textContent = "Momentum = m × v";
            
            tooltip.appendChild(tooltipText);
            
            // Replace the input with the tooltip containing the input
            const parent = input.parentNode;
            const inputClone = input.cloneNode(true);
            
            parent.innerHTML = '';
            tooltip.appendChild(inputClone);
            parent.appendChild(tooltip);
        }
    });
    
    // Add special behavior for total momentum inputs
    document.querySelectorAll('.total-momentum-before, .total-momentum-after').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isNaN(parseFloat(this.value))) {
                const originalValue = parseFloat(this.value);
                const roundedValue = roundToOne(originalValue);
                this.value = roundedValue.toFixed(1);
                
                if (originalValue !== roundedValue) {
                    showToast("Total momentum to 1 decimal place to avoid rounding error", 'info');
                }
            }
        });
    });
});

// Check student answers
checkAnswersBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.student-input');
    if (inputs.length === 0) {
        showToast("No results to check. Capture some results first.", 'warning');
        return;
    }
    
    let correctCount = 0;
    let totalCount = 0;
    
    inputs.forEach(input => {
        const studentValue = parseFloat(input.value);
        const correctValue = parseFloat(input.dataset.correct);
        
        // Only count if student entered a value
        if (!isNaN(studentValue)) {
            totalCount++;
            
            // For total momentum, round student input to 1 decimal place for comparison
            let comparisonValue = studentValue;
            if (input.classList.contains('total-momentum-before') || input.classList.contains('total-momentum-after')) {
                comparisonValue = roundToOne(studentValue);
            }
            
            // Check if student's answer matches
            if (Math.abs(comparisonValue - correctValue) < TOLERANCE) {
                input.classList.add('correct-answer');
                input.classList.remove('incorrect-answer');
                correctCount++;
            } else {
                input.classList.add('incorrect-answer');
                input.classList.remove('correct-answer');
            }
        } else {
            // Student didn't enter anything for this field
            input.classList.remove('correct-answer', 'incorrect-answer');
        }
    });
    
    if (totalCount > 0) {
        const percentage = Math.round((correctCount / totalCount) * 100);
        const message = `You got ${correctCount} out of ${totalCount} answers correct (${percentage}%).`;
        showToast(message, 'score');
    } else {
        showToast("Please enter your calculations before checking answers.", 'warning');
    }
});

// Clear table
clearTableBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all results?")) {
        beforeTableBody.innerHTML = `
            <tr id="emptyRowBefore">
                <td colspan="9" class="empty-message">No results captured yet. Run a simulation and click "Capture Results".</td>
            </tr>
        `;
        afterTableBody.innerHTML = `
            <tr id="emptyRowAfter">
                <td colspan="10" class="empty-message">No results captured yet. Run a simulation and click "Capture Results".</td>
            </tr>
        `;
        resultCount = 0;
    }
});

// Download CSV
downloadBtn.addEventListener('click', () => {
    if (resultCount === 0) {
        showToast("No results to download. Capture some results first.", 'warning');
        return;
    }
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Experiment,Collision Type,m₁ (kg),v₁ before (m/s),m₂ (kg),v₂ before (m/s),";
    csvContent += "p₁ before (kg·m/s),p₂ before (kg·m/s),p total before (kg·m/s),";
    csvContent += "m₁ (kg),v₁ after (m/s),m₂ (kg),v₂ after (m/s),";
    csvContent += "p₁ after (kg·m/s),p₂ after (kg·m/s),p total after (kg·m/s),Notes\n";
    
    // Get all rows from both tables
    const beforeRows = Array.from(beforeTableBody.querySelectorAll('tr:not(#emptyRowBefore)'));
    const afterRows = Array.from(afterTableBody.querySelectorAll('tr:not(#emptyRowAfter)'));
    
    // Combine data from both tables
    for (let i = 0; i < beforeRows.length; i++) {
        const beforeCells = Array.from(beforeRows[i].querySelectorAll('td'));
        const afterCells = Array.from(afterRows[i].querySelectorAll('td'));
        
        // Extract data from before table
        const rowNum = beforeCells[0].textContent;
        const collisionType = beforeCells[1].textContent;
        const m1Before = beforeCells[2].textContent;
        const v1Before = beforeCells[3].textContent;
        const m2Before = beforeCells[4].textContent;
        const v2Before = beforeCells[5].textContent;
        
        // Get momentum values (either student input or correct values)
        const p1Before = getInputValueOrCorrect(beforeCells[6]);
        const p2Before = getInputValueOrCorrect(beforeCells[7]);
        const pTotalBefore = getInputValueOrCorrect(beforeCells[8]);
        
        // Extract data from after table
        const m1After = afterCells[2].textContent;
        const v1After = afterCells[3].textContent;
        const m2After = afterCells[4].textContent;
        const v2After = afterCells[5].textContent;
        const p1After = getInputValueOrCorrect(afterCells[6]);
        const p2After = getInputValueOrCorrect(afterCells[7]);
        const pTotalAfter = getInputValueOrCorrect(afterCells[8]);
        const notes = afterCells[9]?.querySelector('input')?.value || "";
        
        // Combine all data
        const rowData = [
            rowNum, collisionType, 
            m1Before, v1Before, m2Before, v2Before,
            p1Before, p2Before, pTotalBefore,
            m1After, v1After, m2After, v2After,
            p1After, p2After, pTotalAfter, notes
        ];
        
        csvContent += rowData.join(',') + '\n';
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "momentum_experiment_results.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
});

// Helper function to get input value or correct value
function getInputValueOrCorrect(cell) {
    const input = cell.querySelector('input');
    if (input && input.value) {
        return input.value;
    } else if (input) {
        return input.dataset.correct;
    }
    return "";
}
