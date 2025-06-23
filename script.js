
const data = {
    A: ['Jezero', 'Kisela', 'Slana', 'Piće', 'Voda'],
    B: ['Sneg', 'Para', 'Led', 'Kap', 'Voda'],
    C: ['Plivanje', 'Čamac', 'Dubina', 'Mokro', 'Voda'],
    D: ['Tuš', 'Kada', 'Česma', 'Kanal', 'Voda'],
    final: 'Voda'
};

let revealed = [];
let score = 0;
let timerInterval;
let timeLeft = 180;

function renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    ['A','B','C','D'].forEach(column => {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column';

        data[column].slice(0, 4).forEach((item, i) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = `${column}${i+1}`;
            cell.dataset.col = column;
            cell.dataset.index = i;
            cell.onclick = () => reveal(cell, column, i);
            columnDiv.appendChild(cell);
        });

        const solutionCell = document.createElement('div');
        solutionCell.className = 'cell solution';
        solutionCell.textContent = `Rešenje ${column}`;
        solutionCell.onclick = () => guessColumn(column, solutionCell);
        columnDiv.appendChild(solutionCell);

        board.appendChild(columnDiv);
    });
}

function reveal(cell, column, index) {
    const key = column + index;
    if (!revealed.includes(key)) {
        cell.textContent = data[column][index];
        cell.classList.add('revealed');
        revealed.push(key);
    }
}

function guessColumn(column, cell) {
    if (revealed.includes(column + 'final')) return;

    Swal.fire({
        title: `Rešenje kolone ${column}?`,
        input: 'text',
        inputPlaceholder: 'Unesi rešenje',
        showCancelButton: true
    }).then(result => {
        if (result.value?.toLowerCase() === data[column][4].toLowerCase()) {
            Swal.fire('Tačno!', '', 'success');
            revealed.push(column + 'final');
            cell.textContent = data[column][4];
            cell.classList.add('revealed');
            score += 10;
            updateScore();
        } else {
            Swal.fire('Netačno', '', 'error');
            score -= 2;
            updateScore();
        }
    });
}

function checkFinal() {
    const answer = document.getElementById('finalAnswer').value.trim().toLowerCase();
    if (answer === data.final.toLowerCase()) {
        Swal.fire('Bravo! Pogodio si konačno rešenje!', '', 'success');
        score += 30;
        updateScore();
        saveResult();
        clearInterval(timerInterval);
    } else {
        Swal.fire('Netačno konačno rešenje.', '', 'error');
        score -= 5;
        updateScore();
    }
}

function updateScore() {
    document.getElementById('points').textContent = `🎯 Poeni: ${score}`;
}

function updateTimer() {
    document.getElementById('timer').textContent = `⏱️ Vreme: ${timeLeft}s`;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        Swal.fire('Vreme je isteklo!', '', 'warning');
    }
    timeLeft--;
}

function saveResult() {
    let results = JSON.parse(localStorage.getItem('asocijacije-rezultati')) || [];
    const time = new Date().toLocaleString();
    results.push({ time, score });
    localStorage.setItem('asocijacije-rezultati', JSON.stringify(results));
    renderResults();
}

function renderResults() {
    const results = JSON.parse(localStorage.getItem('asocijacije-rezultati')) || [];
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '<h3>Istorija pokušaja</h3>' + results.map(r => `<div>${r.time} – ${r.score} poena</div>`).join('');
}

function restartGame() {
    revealed = [];
    score = 0;
    timeLeft = 180;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('finalAnswer').value = '';
    updateScore();
    updateTimer();
    renderBoard();
    renderResults();
}

timerInterval = setInterval(updateTimer, 1000);
renderBoard();
renderResults();
updateScore();
updateTimer();
