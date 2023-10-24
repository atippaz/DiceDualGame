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
        const size = boardData.boardSize
        for (let indexI = 0; indexI < size; indexI++) {
            const row = board[indexI][0]
            const rowWin = board[indexI].every(
                (cell, index) => row !== null && row === board[indexI][index]
            )
            const col = board[0][indexI]
            const colWin = board.every(
                (cell, index) => col !== null && col === board[index][indexI]
            )

            if (rowWin || colWin) {
                boardData.gameOver = true
                return this.returnWinState(true, board[indexI][0])
            }
        }

        // Check for diagonal wins
        const diagonal1 = board[0][0]
        let outbound = 0
        const diagonal1Win = board.every((cell, index) => {
            outbound = index
            return diagonal1 === board[index][index] && diagonal1 !== null
        })
        const diagonal2 = board[outbound][outbound]
        const diagonal2Win = board.every((cell, index) => {
            outbound -= 1
            return (
                diagonal1 === board[outbound + 1][outbound + 1] &&
                diagonal2 !== null
            )
        })

        if (diagonal1Win || diagonal2Win) {
            boardData.gameOver = true
            return this.returnWinState(true, board[0][board[0].length])
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
    createBoardGame(roomId, player, size = 3) {
        const symbol = player.map((e) => {
            return { playerId: e.playerId, symbol: '' }
        })
        const newBoard = {
            board: Array(size)
                .fill(null)
                .map(() => Array(size).fill(null)),
            roomId: roomId,
            roundPlayerId: null,
            gameOver: false,
            canMove: false,
            dataSymbol: symbol,
            boardSize: size,
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
    removeBoard(roomId) {
        //remove
        const boardindex = xoGameState.findIndex((e) => e.roomId === roomId)
        if (boardindex !== 1) {
            xoGameState.splice(boardindex, 1)
        }
    },

    getBoardData(roomId) {
        const boardId = xoGameState.findIndex((e) => e.roomId === roomId)
        if (boardId !== -1) {
            return xoGameState[boardId]
        }
        return null
    },
    assignDataToRoom(roomId, data) {
        const boardId = xoGameState.findIndex((e) => e.roomId === roomId)
        if (boardId !== -1) {
            xoGameState[boardId] = data
        }
        return null
    },
}
const xoGameState = []
export { xoGameService, xoGameState }
