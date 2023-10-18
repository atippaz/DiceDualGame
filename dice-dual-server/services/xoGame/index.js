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
    checkWin(boardData) {
        const { board } = boardData
        for (let indexI = 0; indexI < board.length; indexI++) {
            const boardCol = board[indexI]
            for (let indexJ = 0; indexJ < boardCol.length; indexJ++) {
                if (
                    board[indexJ][0] !== null &&
                    board[indexJ][0] === board[indexJ][1] &&
                    board[indexJ][0] === board[indexJ][2]
                ) {
                    boardData.gameOver = true
                    return this.returnWinState(true, board[indexJ][0])
                }
                if (
                    board[0][indexJ] !== null &&
                    board[0][indexJ] === board[1][indexJ] &&
                    board[0][indexJ] === board[2][indexJ]
                ) {
                    boardData.gameOver = true
                    return this.returnWinState(true, board[0][indexJ])
                }
            }
        }

        if (
            board[0][0] !== null &&
            board[0][0] === board[1][1] &&
            board[0][0] === board[2][2]
        ) {
            boardData.gameOver = true
            return this.returnWinState(true, boardboard[0][0])
        }

        if (
            board[0][2] !== null &&
            board[0][2] === board[1][1] &&
            board[0][2] === board[2][0]
        ) {
            boardData.gameOver = true
            return this.returnWinState(true, board[0][2])
        }

        // Check for a draw
        if (!board.flat().includes(null)) {
            boardData.gameOver = true
            return this.returnWinState(true, 'draw')
        }

        return this.returnWinState(true, null)
    },
    returnWinState(state, symbol) {
        return { moved: state, symbol: symbol }
    },
    makeMove(roomId, target, playerId) {
        try {
            const boardData = this.getBoardData(roomId)
            const { board } = boardData
            const { row, col } = target
            if (board != null && board[row][col] === null && !board.gameOver) {
                const symbol = boardData.dataSymbol.find(
                    (x) => x.playerId === playerId
                ).symbol
                board[row][col] = symbol
                return this.checkWin(boardData)
            } else {
                return this.returnWinState(false, null)
            }
        } catch (er) {
            return this.returnWinState(false, null)
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
    createBoardGame(roomId, player) {
        const symbol = player.map((e) => {
            return { playerId: e.playerId, symbol: '' }
        })
        const newBoard = {
            board: Array(3)
                .fill(null)
                .map(() => Array(3).fill(null)),
            roomId: roomId,
            roundPlayerId: null,
            gameOver: false,
            canMove: false,
            dataSymbol: symbol,
        }
        xoGameState.push(newBoard)
        return newBoard
    },
    updateSymbol(roomId, playerId, symbol) {
        const boardId = xoGameState.findIndex((e) => e.roomId === roomId)
        if (boardId !== -1) {
            const playerIdx = xoGameState[boardId].dataSymbol.findIndex(
                (e) => e.playerId === playerId
            )
            if (playerIdx != -1) {
                xoGameState[boardId].dataSymbol[playerIdx].symbol = symbol
            }
        }
    },
    removeRoom(roomId) {
        //remove
    },

    getBoardData(roomId) {
        const boardId = xoGameState.findIndex((e) => e.roomId === roomId)
        if (boardId !== -1) {
            return xoGameState[boardId]
        }
        return null
    },
}
const xoGameState = []
export { xoGameService, xoGameState }
