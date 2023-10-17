const xoSocket = (store, socket) => {
    return {
        startServer: () => {
            socket.on('connection', (_socket) => {
                _socket.on('joinRoom', ({ roomId, playerId }) => {
                    _socket.join(roomId)
                    _socket.userId = playerId
                    socket
                        .to(roomId)
                        .emit('joinRoom', `สวัสดีทุกคน! ฉัน ${playerId}`)
                })
                _socket.on('requestGameData', (roomId) => {
                    const { room } = store.services
                    const response = room.getDataRoomGame(
                        roomId,
                        _socket.userId
                    )
                    if (response !== null) {
                        socket.to(_socket.id).emit('roomGameData', response)
                        socket.to(roomId).emit('getRequestRoom', null)
                    }
                })
                _socket.on('getRequestGameData', (roomId) => {
                    const { room } = store.services
                    const response = room.getDataRoomGame(
                        roomId,
                        _socket.userId
                    )
                    if (response !== null) {
                        return socket
                            .to(_socket.id)
                            .emit('getRequestGameData', response)
                    }
                })

                _socket.on('requestBoardGameData', (roomId) => {
                    const { xoGame } = store.services
                    const boardData = xoGame.getBoardData(roomId)
                    if (boardData != null) {
                        return socket.to(_socket.id).emit('boardGameData', boardData)
                    }
                    return socket.to(_socket.id).emit('boardGameData', null)
                })
                _socket.on('requestGetBoardGame', (roomId) => {
                    const { xoGame } = store.services
                    const boardData = xoGame.getBoardData(roomId)
                    if (boardData != null) {
                        return socket.to(roomId).emit('boardGameData', boardData)
                    }
                    return socket.to(roomId).emit('boardGameData', null)
                })
            })
        },
        // getBoardGame: (roomId) => {
        //     const board = store.services.xoGame.getBoardData(roomId)
        //     socket.to(roomId).emit('boardGameData', board)
        // },
        sendRoomData: (roomId) => {
            const { room, xoGame } = store.state
            const roomIdx = store.state.room.findIndex(
                (x) => x.roomId === roomId
            )
            if (roomId !== -1) {
                const roomData = store.state.room[roomIdx]
                return socket.to(roomId).emit('roomGameData', roomData)
            }
        },
    }
}
export default xoSocket
