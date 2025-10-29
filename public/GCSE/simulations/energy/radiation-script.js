// Initial temperatures
const initialTemps = {
    black: 85,
    clear: 85,
    white: 85,
    silver: 85
};

let currentTemps = {...initialTemps};
let intervalId = null;
let stopwatchInterval = null;
let seconds = 0;
let isRunning = false;

// Cooling rates (how much each tube cools per second)
const coolingRates = {
    black: 0.15,
    clear: 0.12,
    white: 0.09,
    silver: 0.06
};

// DOM elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const stopwatchDisplay = document.getElementById('stopwatch');

// Update thermometer and temperature display
// Modify the updateTemperatures function
function updateTemperatures() {
    const roomTemp = 20.0; // Ambient temperature
    const timeStep = 1.0; // Seconds per update
    
    for (const color in currentTemps) {
        if (currentTemps[color] > roomTemp) {
            // Material-specific cooling coefficients (lower = slower cooling)
            const materialCoefficients = {
                black: 0.004,  // Best emitter
                clear: 0.003,
                white: 0.002,
                silver: 0.001  // Worst emitter
            };
            
            // Newton's Law of Cooling: dT/dt = -k(T - T_env)
            const deltaT = -materialCoefficients[color] * 
                         (currentTemps[color] - roomTemp) * 
                         timeStep;
            
            currentTemps[color] += deltaT * (0.95 + Math.random() * 0.1);
            
            // Ensure we don't go below room temp
            currentTemps[color] = Math.max(currentTemps[color], roomTemp);
        }
        
        // Update display (existing code)
        const mercuryHeight = 10 + (currentTemps[color] - roomTemp) * (160 / 65);
        document.getElementById(`mercury-${color}`).style.height = `${mercuryHeight}px`;
        document.getElementById(`temp-${color}`).textContent = `${Math.round(currentTemps[color])}°C`;
    }
}
// Start the experiment
function startExperiment() {
    if (isRunning) return;
    
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    
    // Start temperature update interval
    intervalId = setInterval(updateTemperatures, 1000);
    
    // Start stopwatch
    seconds = 0;
    stopwatchInterval = setInterval(updateStopwatch, 1000);
}

// Stop the experiment
function stopExperiment() {
    if (!isRunning) return;
    
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    clearInterval(intervalId);
    clearInterval(stopwatchInterval);
}

// Reset the experiment
function resetExperiment() {
    stopExperiment();
    
    // Reset temperatures
    currentTemps = {...initialTemps};
    
    // Reset displays
    for (const color in currentTemps) {
        document.getElementById(`mercury-${color}`).style.height = '170px';
        document.getElementById(`temp-${color}`).textContent = '85°C';
    }
    
    // Reset stopwatch
    seconds = 0;
    stopwatchDisplay.textContent = '00:00';
}

// Update stopwatch display
function updateStopwatch() {
    seconds++;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    stopwatchDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Event listeners
startBtn.addEventListener('click', startExperiment);
stopBtn.addEventListener('click', stopExperiment);
resetBtn.addEventListener('click', resetExperiment);




document.querySelectorAll('button').forEach(button => {
    button.style.touchAction = 'manipulation'; // Improve touch responsiveness
    button.style.webkitTapHighlightColor = 'transparent'; // Remove tap highlight
});

document.addEventListener('dblclick', (e) => {
    e.preventDefault();
}, { passive: false });
