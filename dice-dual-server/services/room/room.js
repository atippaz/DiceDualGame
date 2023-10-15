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
    createNewRoom: (roomId, roomName, maxPlayer) => {
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
            maxPlayer: maxPlayer,
        })
        return true
    },
    joinRoom: (roomId, playerId, playerName) => {
        const idx = roomState.findIndex((e) => e.roomId === roomId)
        if (idx === -1) return
        if (roomState[idx].players >= roomState[idx].maxPlayer) return
        const playerIdx = roomState[idx].players.findIndex(
            (e) => e.playerUuid === null
        )
        roomState[idx].players[playerIdx].playerUuid = playerId
        roomState[idx].players[playerIdx].player = playerName
    },
    deleteRoom(roomId) { },
    startGame: (roomId) => {
        const idx = roomState.findIndex((e) => e.roomId === roomId)
        if (idx === -1) return false
        if (roomState[idx].players == roomState[idx].maxPlayer) return true
        return false
    },
    moveDice: ({ dice: { value } }, playerId) => {
        const idx = roomState.findIndex((e) =>
            e.players.some((x) => x.playerUuid === playerId)
        )
        console.log(idx)
    },
}
export { roomState, roomServices }
