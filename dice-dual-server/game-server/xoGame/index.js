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
                        socket.to(roomId).emit('getRequestRoom', {})
                    }
                })
                _socket.on('getRequestGameData', (roomId) => {
                    const { room } = store.services
                    const response = room.getDataRoomGame(
                        roomId,
                        _socket.userId
                    )
                    if (response !== null) {
                        socket
                            .to(_socket.id)
                            .emit('getRequestGameData', response)
                    }
                })
            })
        },
        sendRoomData: (roomId) => {
            const { room, xoGame } = store.state
            const roomIdx = store.state.room.findIndex(
                (x) => x.roomId === roomId
            )
            if (roomId !== -1) {
                const roomData = store.state.room[roomIdx]
                socket.to(roomId).emit('roomGameData', roomData)
            }
        },
    }
}
export default xoSocket
