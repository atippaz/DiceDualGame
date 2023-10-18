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
        onGetCurrentRoom: (req, res) => {
            try {
                const playerId = req.user.userId
                const data = store.state.room.filter(
                    (e) =>
                        e.gameType == GameType.XoGame &&
                        e.isActive &&
                        (e.owner === playerId ||
                            e.players.some((y) => y.playerId === playerId))
                )
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
        onGetAll: (req, res) => {
            try {
                const playerId = req.user.userId
                const data = store.state.room.filter(
                    (e) =>
                        e.gameType == GameType.XoGame &&
                        e.isActive &&
                        e.owner !== playerId &&
                        !e.players.some((y) => y.playerId === playerId)
                )
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
                const boardGameData = store.services.xoGame.createBoardGame(
                    roomId,
                    roomData.players
                )

                store.services.room.startRoom(roomId)
                const random = Math.floor(Math.random() * roomData.maxPlayer)
                const turnPlayerId = roomData.players[random].playerId
                roomData.players.forEach((e) => {
                    if (e.playerId === turnPlayerId) {
                        store.services.xoGame.updateSymbol(
                            roomId,
                            turnPlayerId,
                            'X'
                        )
                    } else {
                        store.services.xoGame.updateSymbol(
                            roomId,
                            e.playerId,
                            'O'
                        )
                    }
                })
                boardGameData.roundPlayerId = turnPlayerId
                boardGameData.canMove = turnPlayerId === playerId
                return responseData(res, 200, boardGameData)
            }
            return responseData(res, 403, null)
        },
        createNewRoom: async (req, res) => {
            const { roomName } = req.body
            const user = req.user
            const playerId = user.userId
            const playerName = user.name
            if (store.services.room.isOwnerRoom(playerId)) {
                return responseData(res, 403, null)
            }
            const roomData = store.services.room.createNewRoom(
                roomName,
                GameType.XoGame,
                playerId
            )
            console.log('init socket')
            console.log(roomData);
            if (roomData.status) {
                if (
                    store.services.room.joinRoom(
                        roomData.roomId,
                        playerId,
                        playerName
                    )
                ) {
                    await socket.createRoom()
                    console.log('init success')
                    return responseData(res, 200, {
                        roomId: roomData.roomId,
                        roomName: roomName,
                        playerId: playerId,
                    })
                }
                return responseData(res, 403, null)
            }
            return responseData(res, 403, null)
        },
        joinRoom: (req, res) => {
            const { roomId } = req.body
            const user = req.user
            const playerId = user.userId
            const playerName = user.name
            if (store.services.room.joinRoom(roomId, playerId, playerName)) {
                return responseData(res, 200, {
                    roomId: roomId,
                    playerId: playerId,
                })
            } else {
                if (store.services.room.hasRoom(roomId))
                    return responseData(res, 403, null)
                return responseData(res, 404, null)
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
            return responseData(res, 404, null)
        },
        resumeGame(req, res) {
            const { roomId } = req.body
            const user = req.user
            const playerId = user.userId
            if (store.services.room.hasPlayerInRoom(roomId, playerId)) {
                socket.join(roomId)
                return responseData(res, 200, null)
            }
            return responseData(res, 404, null)
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
                return responseData(res, 404, null)
            }
        },
        getBoardGameById(req, res) {
            const { roomId } = req.params
            const { userId } = req.user
            const boardGameData = store.services.xoGame.getBoardData(roomId)
            boardGameData.canMove = boardGameData.roundPlayerId === userId
            return responseData(res, 200, boardGameData)
        },
        exitRoom(req, res) { },
        deleteRoom(req, res) { },
    }
}
