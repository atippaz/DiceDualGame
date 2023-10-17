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
    createNewRoom: (roomName, gameType, playerId, maxPlayer = 2) => {
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
            owner: playerId,
        })
        return { roomId, gameType, status: true }
    },
    joinRoom: (roomId, playerId, playerName) => {
        try {
            const idx = roomState.findIndex((e) => e.roomId === roomId)
            if (idx === -1) return
            if (roomState[idx].players >= roomState[idx].maxPlayer) return
            const playerIdx = roomState[idx].players.findIndex(
                (e) => e.playerId === null
            )

            roomState[idx].players[playerIdx].playerId = playerId
            roomState[idx].players[playerIdx].player = playerName
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
    hasPlayerInRoom(roomId, playerId) {
        const idx = roomState.findIndex((e) => e.roomId === roomId)
        if (idx === -1) return false
        if (
            roomState[idx].players.findIndex((e) => e.playerId === playerId) !==
            -1
        ) {
            return true
        }
        return false
    },
    findIndexRoomWithId(roomId) {
        return roomState.findIndex((e) => e.roomId === roomId)
    },
    getPlayerInRoom(roomId) {
        const idx = this.findIndexRoomWithId(roomId)
        if (idx !== -1) {
            const roomData = roomState[idx]
            const players = JSON.parse(
                JSON.stringify(
                    roomData.players.filter((e) => e.playerId !== null)
                )
            )
            return players
        }
        return null
    },
    getDataRoomGame(roomId, playerId) {
        const idx = this.findIndexRoomWithId(roomId)
        if (idx !== -1) {
            const roomData = roomState[idx]
            const players = roomData.players.filter((e) => e.playerId !== null)
            const temp = JSON.parse(JSON.stringify(roomData))
            temp.players = JSON.parse(JSON.stringify(players))
            const response = {
                ...temp,
                canStart:
                    temp.maxPlayer <= temp.players.length &&
                    !temp.started &&
                    temp.owner === playerId,
            }
            return JSON.parse(JSON.stringify(response))
        }
        return null
    },
    getDataRoomGameByRef(roomId, playerId) {
        const idx = this.findIndexRoomWithId(roomId)
        if (idx !== -1) {
            const roomData = roomState[idx]
            const players = roomData.players.filter((e) => e.playerId !== null)
            const temp = JSON.parse(JSON.stringify(roomData))
            temp.players = JSON.parse(JSON.stringify(players))
            const response = {
                ...roomData,
                canStart:
                    roomData.maxPlayer <= temp.players.length &&
                    !roomData.started &&
                    roomData.owner === playerId,
            }
            return response
        }
        return null
    },
    startRoom(roomId) {
        const idx = this.findIndexRoomWithId(roomId)
        if (idx !== -1) {
            roomState[idx].started = true
            return true
        }
        return false
    },
}
export { roomState, roomServices }
