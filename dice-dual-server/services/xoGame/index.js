let currentPlayer = 'X'
let gameOver = false
const xoGameService = {
    resetBoard(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = null
            }
        }

        currentPlayer = 'X'
        gameOver = false
    },
    checkWin(board) {
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0] !== null &&
                board[i][0] === board[i][1] &&
                board[i][0] === board[i][2]
            ) {
                gameOver = true
                return board[i][0]
            }
            if (
                board[0][i] !== null &&
                board[0][i] === board[1][i] &&
                board[0][i] === board[2][i]
            ) {
                gameOver = true
                return board[0][i]
            }
        }

        if (
            board[0][0] !== null &&
            board[0][0] === board[1][1] &&
            board[0][0] === board[2][2]
        ) {
            gameOver = true
            return board[0][0]
        }

        if (
            board[0][2] !== null &&
            board[0][2] === board[1][1] &&
            board[0][2] === board[2][0]
        ) {
            gameOver = true
            return board[0][2]
        }

        // Check for a draw
        if (!board.flat().includes(null)) {
            gameOver = true
            return 'draw'
        }

        return null
    },
    makeMove(board, row, col) {
        if (board[row][col] === null && !gameOver) {
            board[row][col] = currentPlayer
            checkWin()
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
        }
    },
    listCanMove(board) {
        const canMove = []

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === null) {
                    canMove.push({ row, col })
                }
            }
        }

        return canMove
    },
    createBoardGame(roomId) {
        xoGameState.push({
            board: Array(3)
                .fill(null)
                .map(() => Array(3).fill(null)),
            roomId: roomId,
        })
    },
    removeRoom(roomId) {
        //remove
    },
}
const xoGameState = []
export { xoGameService, xoGameState }
