class RampSimulation {
    constructor() {
        // All values in metres
        this.rampLength = 2; // Fixed 2m ramp length
        this.height = 0.2; // 20cm in metres
        this.gateDistance = 1.0; // 1m gate distance
        this.currentTime = 0;
        this.isRunning = false;
        this.startTime = 0;
        this.trialCount = 0;
        this.lastRecordedTime = 0;
        this.rampWidth = 0;
        this.rampLeft = 0;
        this.rampBottom = 80; // Fixed bottom position in pixels

        this.initializeElements();
        this.setupEventListeners();
        this.updateSimulation();
        this.currentTrialSet = 1;
        this.trialTimes = [];
        this.trialsInCurrentSet = 0;
        this.trialCount = 0;
    }

    initializeElements() {
        this.ramp = document.getElementById('ramp');
        this.car = document.getElementById('car');
        this.gate1 = document.getElementById('gate1');
        this.gate2 = document.getElementById('gate2');
        this.timer = document.getElementById('timer');
        this.status = document.getElementById('status');
        this.heightSlider = document.getElementById('heightSlider');
        this.distanceSlider = document.getElementById('distanceSlider');
        this.heightValue = document.getElementById('heightValue');
        this.distanceValue = document.getElementById('distanceValue');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.recordBtn = document.getElementById('recordBtn');
        this.clearDataBtn = document.getElementById('clearDataBtn');
        this.dataTableBody = document.getElementById('dataTableBody');

        // Set initial slider values
        this.heightSlider.value = this.height * 100; // Convert to cm for slider
        this.distanceSlider.value = this.gateDistance * 100; // Convert to cm for slider

        // Update display values
        this.heightValue.textContent = `${this.height.toFixed(2)} m`;
        this.distanceValue.textContent = `${this.gateDistance.toFixed(2)} m`;

        // Calculate initial ramp position
        this.calculateRampDimensions();
    }

    calculateRampDimensions() {
        const simulationArea = document.getElementById('simulationArea');
        const areaWidth = simulationArea.offsetWidth;
        
        // Calculate responsive ramp width
        this.rampWidth = areaWidth * 0.8;
        if (window.innerWidth >= 768) {
            this.rampWidth = areaWidth * 0.7;
            this.rampBottom = 180; // Adjust for larger screens
        }
        if (window.innerWidth >= 1024) {
            this.rampWidth = areaWidth * 0.6;
        }
        
        this.rampLeft = (areaWidth - this.rampWidth) / 2;
    }

    setupEventListeners() {
        this.heightSlider.addEventListener('input', () => {
            this.height = parseInt(this.heightSlider.value) / 100; // Convert cm to m
            this.heightValue.textContent = `${this.height.toFixed(2)} m`;
            this.resetTrialProgress();
            this.updateSimulation();
        });

        this.distanceSlider.addEventListener('input', () => {
            this.gateDistance = parseInt(this.distanceSlider.value) / 100; // Convert cm to m
            this.distanceValue.textContent = `${this.gateDistance.toFixed(2)} m`;
            this.resetTrialProgress();
            this.updateSimulation();
        });

        this.startBtn.addEventListener('click', () => this.startExperiment());
        this.resetBtn.addEventListener('click', () => this.resetExperiment());
        this.recordBtn.addEventListener('click', () => this.recordData());
        this.clearDataBtn.addEventListener('click', () => this.clearAllData());

        // Handle window resize
        window.addEventListener('resize', () => {
            this.calculateRampDimensions();
            this.updateSimulation();
        });

        
    }

    updateSimulation() {
        // Calculate ramp angle based on height
        const angleRad = Math.atan(this.height / this.rampLength);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // Update ramp position and rotation
        this.ramp.style.width = `${this.rampWidth}px`;
        this.ramp.style.left = `${this.rampLeft}px`;
        this.ramp.style.bottom = `${this.rampBottom}px`;
        this.ramp.style.transform = `rotate(${angleDeg}deg)`;

        // Calculate positions along the ramp
        const gate1Distance = (this.rampLength - this.gateDistance) / 2;
        const gate2Distance = gate1Distance + this.gateDistance;

        // Calculate gate positions in pixels (following the ramp angle)
        const gate1XPixels = this.rampLeft + (gate1Distance / this.rampLength) * this.rampWidth;
        const gate2XPixels = this.rampLeft + (gate2Distance / this.rampLength) * this.rampWidth;

        // Calculate vertical offsets for gates (following ramp incline)
        const gate1VerticalOffset = -Math.sin(angleRad) * (gate1Distance / this.rampLength) * this.rampWidth;
        const gate2VerticalOffset = -Math.sin(angleRad) * (gate2Distance / this.rampLength) * this.rampWidth;

        // Position gates (aligned with ramp surface)
        this.gate1.style.left = `${gate1XPixels}px`;
        this.gate1.style.bottom = `${this.rampBottom + gate1VerticalOffset+30}px`;
        //this.gate1.style.transform = `rotate(${angleDeg}deg)`;
        
        this.gate2.style.left = `${gate2XPixels}px`;
        this.gate2.style.bottom = `${this.rampBottom + gate2VerticalOffset+30}px`;
        //this.gate2.style.transform = `rotate(${angleDeg}deg)`;

        // Position car at start (aligned with ramp)
        const carXPixels = this.rampLeft;
        const carVerticalOffset = Math.sin(angleRad) * (0 / this.rampLength) * this.rampWidth; // 0 at start
        
        this.car.style.left = `${carXPixels}px`;
        this.car.style.bottom = `${this.rampBottom + carVerticalOffset+12}px`;
      this.car.style.transformOrigin = '0% 100%';
        this.car.style.transform = `rotate(${angleDeg}deg)`;
      
      this.ramp.style.visibility = 'visible';
    this.car.style.visibility = 'visible';
    this.gate1.style.visibility = 'visible';
    this.gate2.style.visibility = 'visible';
    }
  

    startExperiment() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.currentTime = 0;
        this.startTime = Date.now();
        this.startBtn.disabled = true;
        this.recordBtn.disabled = true;
        this.status.textContent = 'Car rolling...';
        this.status.className = 'status running';

        // Animate car rolling down
        this.animateCar();
    }

    animateCar() {
        const startTime = Date.now();
        const gate1Distance = (this.rampLength - this.gateDistance) / 2;
        const gate2Distance = gate1Distance + this.gateDistance;
        const angleRad = Math.atan(this.height / this.rampLength);
        const angleDeg = angleRad * (180 / Math.PI);

        // Calculate speed based on height
        const speed = Math.sqrt(2 * 9.81 * this.height);
        const totalTime = (this.rampLength / speed) * 1000;

        let gate1Triggered = false;
        let gate2Triggered = false;
        let timerStarted = false;
        let experimentComplete = false;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / totalTime, 1);

            // Move car along ramp
            const currentDistance = progress * this.rampLength;

            // Calculate car position along the ramp
            const carXPixels = this.rampLeft + (currentDistance / this.rampLength) * this.rampWidth;
            
            // Calculate vertical offset due to ramp angle (for visual alignment)
            const verticalOffset = -Math.sin(angleRad) * (currentDistance / this.rampLength) * this.rampWidth;
            const carBottomPosition =12+this.rampBottom + verticalOffset;

            this.car.style.left = `${carXPixels}px`;
            this.car.style.bottom = `${carBottomPosition}px`;
            this.car.style.transform = `rotate(${angleDeg}deg)`;

            // Check light gate triggers
            if (!gate1Triggered && currentDistance >= gate1Distance) {
                gate1Triggered = true;
                timerStarted = true;
                this.gate1.classList.add('active');
                this.startTime = Date.now();
                this.updateTimer();
            }

            if (!gate2Triggered && currentDistance >= gate2Distance) {
                gate2Triggered = true;
                this.gate2.classList.add('active');
                this.stopTimer();
                experimentComplete = true;
            }

            if (timerStarted && !experimentComplete) {
                this.updateTimer();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    updateTimer() {
        if (this.isRunning) {
            const actualTime = (Date.now() - this.startTime) / 1000;

            // Apply 5% variation to the displayed time
            const variation = 0.05;
            const randomFactor = 1 + (Math.random() * variation * 2 - variation);
            this.currentTime = actualTime * randomFactor;

            this.timer.textContent = `${this.currentTime.toFixed(3)} s`;
        }
    }

    resetTrialProgress() {
        this.trialsInCurrentSet = 0;
        this.trialTimes = [];
        this.status.textContent = 'Parameters changed. Starting new trial set.';
        this.resetExperiment();
    }

    stopTimer() {
        this.isRunning = false;
        this.lastRecordedTime = this.currentTime;

        this.startBtn.disabled = false;
        this.recordBtn.disabled = false;
        this.status.textContent = `Trial ${this.trialsInCurrentSet + 1}/3 complete! Time: ${this.lastRecordedTime.toFixed(3)}s`;
        this.status.className = 'status ready';
    }

    resetExperiment() {
        this.isRunning = false;
        this.currentTime = 0;
        this.timer.textContent = '0.000 s';
        this.status.textContent = 'Ready to start';
        this.status.className = 'status ready';
        this.startBtn.disabled = false;
        this.recordBtn.disabled = true;
        this.gate1.classList.remove('active');
        this.gate2.classList.remove('active');

        this.updateSimulation();
    }

    recordData() {
        if (this.lastRecordedTime === 0) return;

        this.trialsInCurrentSet++;
        this.trialTimes.push(this.lastRecordedTime);

        // Create or update the table row after each trial
        this.updateDataTable();

        // Update status to show progress
        this.status.textContent = `Recorded trial ${this.trialsInCurrentSet}/3.`;

        // If we have 3 trials, finalize the data
        if (this.trialsInCurrentSet === 3) {
            // Reset for next trial set
            this.currentTrialSet++;
            this.trialsInCurrentSet = 0;
            this.trialTimes = [];
            this.recordBtn.disabled = true;
            this.resetExperiment();
        } else {
            // Reset for the next trial in the current set
            this.resetForNextTrial();
        }
    }

    updateDataTable() {
        // Find or create the row for current trial set
        let row = document.querySelector(`tr[data-trial-set="${this.currentTrialSet}"]`);

        if (!row) {
            // Create new row if it doesn't exist
            row = document.createElement('tr');
            row.setAttribute('data-trial-set', this.currentTrialSet);
            row.innerHTML = `
                <td>${this.currentTrialSet}</td>
                <td>${this.height.toFixed(2)}</td>
                <td>${this.gateDistance.toFixed(2)}</td>
                <td></td><td></td><td></td>
                <td></td>
                <td>
                    <input type="number" class="speed-input" placeholder="Enter speed" step="0.01">
                    <span>m/s</span>
                </td>
                <td class="validation-cell">
                    <i class="validation-icon"></i>
                </td>
            `;
            this.dataTableBody.appendChild(row);
        }

        // Update the specific trial cell
        const trialCell = row.cells[2 + this.trialsInCurrentSet];
        trialCell.textContent = this.lastRecordedTime.toFixed(3);

        // If all 3 trials are done, calculate and display average
        if (this.trialsInCurrentSet === 3) {
            const averageTime = this.trialTimes.reduce((sum, time) => sum + time, 0) / 3;
            row.cells[6].textContent = averageTime.toFixed(3);

            // Add event listener to the speed input
            const speedInput = row.querySelector('.speed-input');
            const validationIcon = row.querySelector('.validation-icon');

            speedInput.addEventListener('input', () => {
                this.validateSpeedInput(speedInput, validationIcon, averageTime);
            });
        }
    }

    resetForNextTrial() {
        this.isRunning = false;
        this.currentTime = 0;
        this.timer.textContent = '0.000 s';
        this.startBtn.disabled = false;
        this.recordBtn.disabled = false;
        this.gate1.classList.remove('active');
        this.gate2.classList.remove('active');
        this.updateSimulation();
    }

    validateSpeedInput(input, icon, averageTime) {
        const userSpeed = parseFloat(input.value);
        const distance = this.gateDistance;

        if (isNaN(userSpeed)) {
            input.classList.remove('correct', 'incorrect');
            icon.className = 'validation-icon';
            return;
        }

        // Calculate actual speed using average time
        const actualSpeed = distance / averageTime;

        // Check if user's speed matches actual speed to 2 significant figures
        const userRounded = parseFloat(userSpeed.toPrecision(2));
        const actualRounded = parseFloat(actualSpeed.toPrecision(2));

        // Allow 5% tolerance for the variation
        const tolerance = 0.05;

        if (Math.abs(userRounded - actualRounded) / actualRounded <= tolerance) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
            icon.className = 'validation-icon correct fas fa-check';
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
            icon.className = 'validation-icon incorrect fas fa-times';
        }
    }

    clearAllData() {
        this.dataTableBody.innerHTML = '';
        this.trialCount = 0;
        this.currentTrialSet = 1;
        this.trialsInCurrentSet = 0;
        this.trialTimes = [];
    }
}


// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        new RampSimulation();
    } catch (error) {
        console.error('Error initializing RampSimulation:', error);
    }
});
