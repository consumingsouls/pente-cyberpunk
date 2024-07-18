const boardSize = 19;
let currentPlayer = 1;
let playerCaptures = [0, 0]; // Player 1 and Player 2 captures
let board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-btn');
const player1CapturesDisplay = document.getElementById('player1-captures');
const player2CapturesDisplay = document.getElementById('player2-captures');
const player1ColorInput = document.getElementById('player1-color');
const player2ColorInput = document.getElementById('player2-color');

player1ColorInput.addEventListener('input', updateColors);
player2ColorInput.addEventListener('input', updateColors);

function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col] !== null) {
        return;
    }

    board[row][col] = currentPlayer;
    event.target.classList.add(currentPlayer === 1 ? 'player1' : 'player2');

    checkCaptures(row, col);
    updateCaptureDisplay();

    if (checkWin(row, col) || playerCaptures[currentPlayer - 1] >= 5) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameBoard.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 }, // Horizontal
        { dr: 1, dc: 0 }, // Vertical
        { dr: 1, dc: 1 }, // Diagonal /
        { dr: 1, dc: -1 } // Diagonal \
    ];

    for (let direction of directions) {
        let count = 1;

        for (let i = 1; i < 5; i++) {
            const newRow = row + i * direction.dr;
            const newCol = col + i * direction.dc;
            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] !== currentPlayer) {
                break;
            }
            count++;
        }

        for (let i = 1; i < 5; i++) {
            const newRow = row - i * direction.dr;
            const newCol = col - i * direction.dc;
            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] !== currentPlayer) {
                break;
            }
            count++;
        }

        if (count >= 5) {
            return true;
        }
    }

    return false;
}

function checkCaptures(row, col) {
    const directions = [
        { dr: 0, dc: 1 }, // Horizontal
        { dr: 1, dc: 0 }, // Vertical
        { dr: 1, dc: 1 }, // Diagonal /
        { dr: 1, dc: -1 } // Diagonal \
    ];

    for (let direction of directions) {
        for (let i = -1; i <= 1; i += 2) { // Check in both directions
            const newRow1 = row + i * direction.dr;
            const newCol1 = col + i * direction.dc;
            const newRow2 = newRow1 + i * direction.dr;
            const newCol2 = newCol1 + i * direction.dc;
            const newRow3 = newRow2 + i * direction.dr;
            const newCol3 = newCol2 + i * direction.dc;

            if (
                newRow3 >= 0 && newRow3 < boardSize && newCol3 >= 0 && newCol3 < boardSize &&
                board[newRow1][newCol1] === 3 - currentPlayer &&
                board[newRow2][newCol2] === 3 - currentPlayer &&
                board[newRow3][newCol3] === currentPlayer
            ) {
                board[newRow1][newCol1] = null;
                board[newRow2][newCol2] = null;
                document.querySelector(`.cell[data-row='${newRow1}'][data-col='${newCol1}']`).classList.remove('player1', 'player2');
                document.querySelector(`.cell[data-row='${newRow2}'][data-col='${newCol2}']`).classList.remove('player1', 'player2');
                playerCaptures[currentPlayer - 1] += 2;
            }
        }
    }
}

function updateCaptureDisplay() {
    player1CapturesDisplay.textContent = `Player 1 Captures: ${playerCaptures[0]}`;
    player2CapturesDisplay.textContent = `Player 2 Captures: ${playerCaptures[1]}`;
}

function restartGame() {
    board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    currentPlayer = 1;
    playerCaptures = [0, 0];
    gameBoard.innerHTML = '';
    createBoard();
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    updateCaptureDisplay();
}

function updateColors() {
    document.documentElement.style.setProperty('--player1-color', player1ColorInput.value);
    document.documentElement.style.setProperty('--player2-color', player2ColorInput.value);
}

restartButton.addEventListener('click', restartGame);

createBoard();
updateColors(); 
statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
