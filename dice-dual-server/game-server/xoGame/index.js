// สร้างตารางเกม 3x3 โดยใช้ Array
const board = Array(3).fill(null).map(() => Array(3).fill(null));

let currentPlayer = 'X';
let gameOver = false;

function makeMove(row, col) {
    if (board[row][col] === null && !gameOver) {
        board[row][col] = currentPlayer;
        checkWin();
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    }
}

function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
            gameOver = true;
            return board[i][0];
        }
        if (board[0][i] !== null && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
            gameOver = true;
            return board[0][i];
        }
    }

    if (board[0][0] !== null && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        gameOver = true;
        return board[0][0];
    }

    if (board[0][2] !== null && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        gameOver = true;
        return board[0][2];
    }

    // Check for a draw
    if (!board.flat().includes(null)) {
        gameOver = true;
        return 'draw';
    }

    return null;
}

function resetBoard() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = null;
        }
    }

    currentPlayer = 'X';
    gameOver = false;
}

// ตัวอย่างการเรียกใช้งานฟังก์ชัน makeMove และ resetBoard
makeMove(0, 0); // X ทำกาาเดินที่ตำแหน่ง (0, 0)
makeMove(1, 1); // O ทำกาาเดินที่ตำแหน่ง (1, 1)
makeMove(0, 1); // X ทำกาาเดินที่ตำแหน่ง (0, 1)
resetBoard(); // รีเซ็ตกระดานเกม
