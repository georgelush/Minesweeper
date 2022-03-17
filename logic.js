
export const SQUARE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

export function createGameBoard(boardSize, numberOfMines) {
    const board = [];
    const minePositions = getMinePostions(boardSize, numberOfMines);
    for (let i = 0; i < boardSize; ++i) {
        const line = [];
        for (let j = 0; j < boardSize; ++j) {
            const element = document.createElement('div');
            element.dataset.status = SQUARE_STATUSES.HIDDEN; 
            const square = {
                element,
                i, j,
                mine: minePositions.some(samePos.bind(null, {i, j})),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                },
            }
            line.push(square);
        }
        board.push(line);
    }
    return board;
}

export function markMine(square) {
    if (square.status !== SQUARE_STATUSES.HIDDEN && square.status !== SQUARE_STATUSES.MARKED) {
        return;
    }

    if (square.status === SQUARE_STATUSES.MARKED) {
        square.status = SQUARE_STATUSES.HIDDEN;
    } else {
        square.status = SQUARE_STATUSES.MARKED;
    }
}

export function discoverSquare(board, square) {
    if (square.status !== SQUARE_STATUSES.HIDDEN) {
        return;
    }
    if (square.mine) {
        square.status = SQUARE_STATUSES.MINE;
        return;
    }
    square.status = SQUARE_STATUSES.NUMBER;
    const neighbors = neighborsOfSquare(board, square);
    const mines = neighbors.filter(neighborMine => neighborMine.mine);
    if (mines.length === 0) {
        neighbors.forEach(discoverSquare.bind(null, board));
    } else {
        square.element.textContent = mines.length;
    }
}

function getMinePostions(boardSize, numberOfMines) {
    const positions = [];
    while (positions.length < numberOfMines) {
        const position = {
            i: randomNumber(boardSize),
            j: randomNumber(boardSize)
        }
        if (!positions.some(samePos.bind(null, position))) {
            positions.push(position);
        }
    }
    return positions;
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function samePos(position, positions) {
    return position.i === positions.i && position.j === positions.j;
}

function neighborsOfSquare(board, {i, j}) {
    const squares = [];
    for (let iPos = -1; iPos <= 1; ++iPos) {
        for (let jPos = -1; jPos <= 1; ++jPos) {
            const squarePos = board[i + iPos]?.[j + jPos];
            if (squarePos) {
                squares.push(squarePos)
            }
        }
    }
    return squares;
}

export function checkWin(board) {
    return board.every(line => {
        return line.every(square => {
            return (square.status === SQUARE_STATUSES.NUMBER ||
            (square.mine && (square.status === SQUARE_STATUSES.HIDDEN ||
            square.status === SQUARE_STATUSES.MARKED))
            )
        })
    })
}

export function checkLose(board) {
    return board.some(line => {
        return line.some(square => {
            return square.status === SQUARE_STATUSES.MINE;
        })
    })
}