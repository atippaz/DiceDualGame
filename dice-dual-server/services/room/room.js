/* {
    roomId:uuid,
    roomName:string,
    players:[{
        player:id,
        playerUuid:id,
        boardGame:[1,2,3,4,5,6,7,8,9],
        sideBoard:[1]
    }],
}*/
const roomState = []
const roomServices = {
    hasRoom: (roomId) => {
        return roomState.findIndex((e) => e.roomId === roomId) !== -1
    },
    createNewRoom: (roomId, roomName) => {
        if (hasRoom(roomId)) return false
        const newPlayer = {
            player: null,
            playerUuid: null,
            boardGame: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            sideBoard: [0],
        }
        roomState.push({
            roomId: roomId,
            roomName: roomName,
            players: [newPlayer, newPlayer],
        })
        return true
    },
}
export { roomState, roomServices }
