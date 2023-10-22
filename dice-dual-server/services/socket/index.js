function getSocketId(playerId) {
    const socketObj = socketState.find(x => x.playerId === playerId)
    return socketObj ? socketObj.socketId : null
}
const socketService = {
    addSocketData: (socketId, playerId) => {
        if (getSocketId(playerId) === null) {

            socketState.push({
                socketId: socketId,
                playerId: playerId
            })
        }
        else {
            socketState.find(x => x.playerId === playerId).socketId === socketId
        }
    },
    getSocketId: getSocketId
}
const socketState = []
export { socketService, socketState }
