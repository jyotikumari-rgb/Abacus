let targetNumber = 0;

let currentBeads = [0, 0, 0, 0, 0];
const MAX_BEADS = 9;

const targetNumberEl = document.getElementById('target-number');
const abacusRodsEl = document.getElementById('abacus-rods');
const controlsContainerEl = document.getElementById('controls-container');
const currentValueEl = document.getElementById('current-value');
const statusMessageEl = document.getElementById('status-message');
const newQuestionBtn = document.getElementById('new-question-btn');

const ROD_LABELS = ['T-Th', 'Th', 'H', 'T', 'O'];
const PLACE_VALUES = [10000, 1000, 100, 10, 1];

function init() {
    renderStructure();
    generateNewQuestion();
    newQuestionBtn.addEventListener('click', generateNewQuestion);
}

function renderStructure() {
    abacusRodsEl.innerHTML = '';
    controlsContainerEl.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const rodContainer = document.createElement('div');
        rodContainer.className = 'flex flex-col items-center justify-end h-full w-12 relative';

        const rod = document.createElement('div');
        rod.className = 'rod';
        rodContainer.appendChild(rod);

        rodContainer.id = `rod-${i}`;
        abacusRodsEl.appendChild(rodContainer);

        const controlGroup = document.createElement('div');
        controlGroup.className = 'flex gap-2 w-20 justify-center';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'control-btn btn-minus';
        minusBtn.innerText = '-';
        minusBtn.onclick = () => updateBeads(i, -1);

        const plusBtn = document.createElement('button');
        plusBtn.className = 'control-btn btn-plus';
        plusBtn.innerText = '+';
        plusBtn.onclick = () => updateBeads(i, 1);

        controlGroup.appendChild(minusBtn);
        controlGroup.appendChild(plusBtn);
        controlsContainerEl.appendChild(controlGroup);
    }
}

function generateNewQuestion() {
    targetNumber = Math.floor(Math.random() * 100000);
    targetNumberEl.textContent = targetNumber;
    currentBeads = [0, 0, 0, 0, 0];
    updateVisuals();
    updateStatus();
}

function updateBeads(rodIndex, change) {
    if (change > 0) {
        addBead(rodIndex);
    } else {
        removeBead(rodIndex);
    }
    updateVisuals();
    checkMatch();
}

function addBead(index) {
    if (index < 0) return;

    currentBeads[index]++;

    if (currentBeads[index] > 9) {
        currentBeads[index] = 0;
        if (index > 0) {
            addBead(index - 1);
        }
    }
}

function removeBead(index) {
    if (currentBeads[index] > 0) {
        currentBeads[index]--;
    }
}

function updateVisuals() {
    let value = 0;
    currentBeads.forEach((count, index) => {
        value += count * PLACE_VALUES[index];
    });

    currentValueEl.textContent = value;

    for (let i = 0; i < 5; i++) {
        const rodContainer = document.getElementById(`rod-${i}`);

        while (rodContainer.children.length > 1) {
            rodContainer.removeChild(rodContainer.lastChild);
        }

        const count = currentBeads[i];
        for (let b = 0; b < count; b++) {
            const bead = document.createElement('div');
            bead.className = `bead bead-${i}`;
            bead.style.bottom = `${48 + (b * 24)}px`;
            rodContainer.appendChild(bead);
        }
    }
}

function updateStatus() {
    statusMessageEl.textContent = "Keep adjusting the beads.";
    statusMessageEl.className = "text-slate-600 mb-6 font-medium min-h-[1.5rem]";
    currentValueEl.classList.remove('match-success');
}

function checkMatch() {
    let value = 0;
    currentBeads.forEach((count, index) => {
        value += count * PLACE_VALUES[index];
    });

    if (value === targetNumber) {
        statusMessageEl.textContent = "You matched the number!";
        statusMessageEl.className = "text-green-600 mb-6 font-bold text-xl min-h-[1.5rem] animate-pop";
        currentValueEl.classList.add('match-success');
    } else {
        statusMessageEl.textContent = "Keep adjusting the beads.";
        statusMessageEl.className = "text-slate-600 mb-6 font-medium min-h-[1.5rem]";
        currentValueEl.classList.remove('match-success');
    }
}

init();