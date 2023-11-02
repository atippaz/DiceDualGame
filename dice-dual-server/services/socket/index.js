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
    getSocketId: getSocketId,
    removeSocketId: (socketId) => {
        const id = socketState.findIndex(x => x.socketId === socketId)
        if (id != -1) socketState.splice(id, 1);
    }
}
const socketState = []
export { socketService, socketState }
