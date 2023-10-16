/* {
    roomId:uuid,
    roomName:string,
    players:[{
        player:id,
        playerId:id,
        boardGame:[1,2,3,4,5,6,7,8,9],
        sideBoard:[1]
    }],
}*/
import { v4 as uuidv4 } from 'uuid'

function hasRoom(roomId) {
    return roomState.findIndex((e) => e.roomId === roomId) !== -1
}
const roomState = []
const roomServices = {
    hasRoom,
    createNewRoom: (roomName, gameType, maxPlayer = 2) => {
        const roomId = uuidv4()

        if (hasRoom(roomId)) return false
        const newPlayer = {
            player: null,
            playerId: null,
        }

        const player = Array.from({ length: maxPlayer }, () =>
            Object.assign({}, newPlayer)
        )
        roomState.push({
            started: false,
            roomId: roomId,
            roomName: roomName,
            gameType: gameType,
            players: player,
            maxPlayer: maxPlayer,
        })
        return { roomId, gameType, status: true }
    },
    joinRoom: (roomId, playerId, playerName) => {
        try {
            console.log('player joining')
            const idx = roomState.findIndex((e) => e.roomId === roomId)
            if (idx === -1) return
            if (roomState[idx].players >= roomState[idx].maxPlayer) return
            const playerIdx = roomState[idx].players.findIndex(
                (e) => e.playerId === null
            )

            roomState[idx].players[playerIdx].playerId = playerId
            roomState[idx].players[playerIdx].player = playerName
            console.log('success')
            return true
        } catch (er) {
            console.error(er)
            return false
        }
    },
    deleteRoom(roomId) {},
    startGame: (roomId) => {
        const idx = roomState.findIndex((e) => e.roomId === roomId)
        if (idx === -1) return false
        if (roomState[idx].players == roomState[idx].maxPlayer) {
            roomState[idx].started = true
            return true
        }
        return false
    },
}
export { roomState, roomServices }
