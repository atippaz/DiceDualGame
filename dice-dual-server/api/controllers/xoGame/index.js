import { responseData } from '../../../helpers/index.js'
import { GameType } from '../../../constant/index.js'
export default (socket, store) => {
    return {
        hasRoom: (req, res) => {
            try {
                const { roomId } = req.body
                return responseData(
                    res,
                    200,
                    store.state.room
                        .filter((e) => e.gameType == GameType.XoGame)
                        .findIndex((e) => e.roomId === roomId) !== -1
                )
            } catch (er) {
                console.log(er)
            }
        },
        onGetAll: (req, res) => {
            try {
                const data = store.state.room.filter(
                    (e) => e.gameType == GameType.XoGame
                )
                console.log(data)
                const result = data.map((e) => {
                    const hasThisPlayerInGame =
                        e.players.findIndex(
                            (y) => y.playerId === req.user.userId
                        ) !== -1
                    const canJoin =
                        e.maxPlayer >
                            e.players.filter((y) => y.playerId !== null)
                                .length &&
                        !e.started &&
                        !hasThisPlayerInGame
                    const canResume = hasThisPlayerInGame && e.started
                    const canView = !canJoin && !canResume

                    return {
                        roomName: e.roomName,
                        roomId: e.roomId,
                        started: e.started,
                        maxPlayer: e.maxPlayer,
                        gameType: e.gameType,
                        players: JSON.parse(
                            JSON.stringify(
                                e.players.filter((y) => y.playerId !== null)
                            )
                        ),
                        canJoin: canJoin,
                        canResume: canResume,
                        canView: canView,
                    }
                })
                console.log(result)
                return responseData(res, 200, result)
            } catch (er) {
                console.log(er)
            }
        },
        startGame(req, res) {
            const playerId = req.user.userId
            const { roomId } = req.body
            const roomData = store.services.room.getDataRoomGameByRef(
                roomId,
                playerId
            )
            if (
                roomData !== null &&
                roomData.canStart &&
                roomData.owner === playerId
            ) {
                const boardGameData =
                    store.services.xoGame.createBoardGame(roomId)
                store.services.room.startRoom(roomId)
                const random = Math.floor(Math.random() * roomData.maxPlayer)
                const turnPlayerId = roomData.players[random].playerId
                boardGameData.roundPlayerId = turnPlayerId
                console.log(boardGameData)
                return responseData(res, 200, boardGameData)
            }
            return responseData(res, 403, {})
        },
        createNewRoom: (req, res) => {
            const { roomName } = req.body
            const user = req.user
            const playerId = user.userId
            const playerName = user.name
            const roomData = store.services.room.createNewRoom(
                roomName,
                GameType.XoGame,
                playerId
            )
            if (roomData.status) {
                if (
                    store.services.room.joinRoom(
                        roomData.roomId,
                        playerId,
                        playerName
                    )
                ) {
                    socket.createRoom()
                    return responseData(res, 200, {
                        roomId: roomData.roomId,
                        roomName: roomName,
                        playerId: playerId,
                    })
                }
                return responseData(res, 403, {})
            }
            return responseData(res, 403, {})
        },
        joinRoom: (req, res) => {
            const { roomId } = req.body
            const user = req.user
            const playerId = user.userId
            const playerName = user.name
            console.log(playerId)
            if (store.services.room.joinRoom(roomId, playerId, playerName)) {
                console.log('join1')
                return responseData(res, 200, {
                    roomId: roomId,
                    playerId: playerId,
                })
            } else {
                if (store.services.room.hasRoom(roomId))
                    return responseData(res, 403, {})
                return responseData(res, 404, {})
            }
        },
        onGetById(req, res) {
            const { roomId } = req.params
            const playerId = req.user.userId

            const response = store.services.room.getDataRoomGame(
                roomId,
                playerId
            )
            if (response !== null) return responseData(res, 200, response)
            return responseData(res, 404, {})
        },
        resumeGame(req, res) {
            const { roomId } = req.body
            const user = req.user
            const playerId = user.userId
            if (store.services.room.hasPlayerInRoom(roomId, playerId)) {
                socket.join(roomId)
                return responseData(res, 200, {})
            }
            return responseData(res, 404, {})
        },
        viewRoom(req, res) {
            const { roomId } = req.params
            const playerId = req.user.userId
            const roomIdx = store.state.room.findIndex(
                (x) => x.roomId === roomId
            )

            if (roomIdx !== -1) {
                const roomData = store.state.room[roomIdx]
                const response = {
                    ...roomData,
                    canStart:
                        roomData.maxPlayer >=
                            roomData.players.filter((e) => e.playerId !== null)
                                .length &&
                        !roomData.started &&
                        roomData.owner === playerId,
                }
                return responseData(res, 200, response)
            } else {
                return responseData(res, 404, {})
            }
        },
        getBoardGameById(req, res) {
            const { roomId } = req.params
            const boardGameData = store.services.xoGame.getBoardData(roomId)
            return responseData(res, 200, boardGameData)
        },
        exitRoom(req, res) {},
        deleteRoom(req, res) {},
    }
}