import {
    createGameBoard,
    markMine,
    SQUARE_STATUSES,
    discoverSquare,
    checkWin,
    checkLose
    } from './logic.js';

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;
const board = createGameBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
const mineLeft = document.querySelector('[mines]');
const verdict = document.querySelector('.subtext');
board.forEach(line => {
    line.forEach(square => {
        boardElement.append(square.element)
        square.element.addEventListener('click', () => {
            discoverSquare(board, square)
            checkGame()
        })
        square.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markMine(square)
            showMineLeft()
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE);
mineLeft.textContent = NUMBER_OF_MINES;

function showMineLeft() {
    const markedSquareCount = board.reduce((count, line) => {
        return count + line.filter(square => square.status === SQUARE_STATUSES.MARKED).length
    }, 0)
    mineLeft.textContent = NUMBER_OF_MINES - markedSquareCount;
}

function checkGame() {
    const win = checkWin(board);
    const lose = checkLose(board);
    if (win || lose) {
        boardElement.addEventListener('click', stopProp, { capture: true });
        boardElement.addEventListener('contextmenu', stopProp, { capture: true });
    }
    if (win) {
        verdict.textContent = "You win";
    } 
    if (lose) {
        verdict.textContent = "You lose";
        board.forEach(line => {
            line.forEach(square => {
            if (square.status === SQUARE_STATUSES.MARKED) {
                markMine(square);
            }
            if (square.mine) {
                discoverSquare(board, square);
            }
        })})
    }
}

function stopProp(e) {
    e.stopImmediatePropagation();
}