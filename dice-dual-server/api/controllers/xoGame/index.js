import { responseData } from '../../../helpers/index.js'
import { GameType } from '../../../constant/index.js'
import { getUserOneWithOutPassword } from '../../service/user.js'
export default (socket, store, mqqt) => {
    return {
        hasRoom: (req, res) => {
            try {
                const { roomId } = req.body
                return responseData(
                    res,
                    200,
                    store.state.room
                        .filter(
                            (e) => e.gameType == GameType.XoGame && e.isActive
                        )
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
                    roomData.players,
                    roomData.boardSize
                )
                if (boardGameData !== null) {
                    store.services.room.startRoom(roomId)
                    const random = Math.floor(
                        Math.random() * roomData.maxPlayer
                    )
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
                    if (store.services.mqqt.getCurrentId() != null) {
                        if (turnPlayerId === store.services.mqqt.getCurrentId()) {
                            mqqt.yourTurn()
                        }
                        else {
                            mqqt.enemyTurn()
                        }
                    }
                    boardGameData.roundPlayerId = turnPlayerId
                    boardGameData.canMove = turnPlayerId === playerId
                    // store.services.mqqt.assignControllerId(playerId)
                    return responseData(res, 200, boardGameData)
                }
                return responseData(res, 404, null)
            }
            return responseData(res, 403, null)
        },
        createNewRoom: async (req, res) => {
            const { roomName } = req.body
            const size = req.body.boardSize || 3

            const user = req.user
            const playerId = user.userId
            const playerName = user.name
            if (store.services.room.isOwnerRoom(playerId)) {
                return responseData(res, 403, null)
            }
            const roomData = store.services.room.createNewRoom(
                roomName,
                GameType.XoGame,
                playerId,
                2,
                size
            )
            if (roomData.status) {
                if (
                    store.services.room.joinRoom(
                        roomData.roomId,
                        playerId,
                        playerName
                    )
                ) {
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
            if (response !== null && response.isActive)
                return responseData(res, 200, response)
            return responseData(res, 404, null)
        },
        resumeGame(req, res) {
            const { roomId } = req.body
            const user = req.user
            const playerId = user.userId
            if (store.services.room.hasPlayerInRoom(roomId, playerId)) {
                return responseData(res, 200, true)
            } else if (store.services.room.isMaxRoom(roomId)) {
                return responseData(res, 403, false)
            }
            return responseData(res, 404, false)
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
        async getBoardGameById(req, res) {
            const { roomId } = req.params
            const { userId } = req.user
            const boardGameData = store.services.xoGame.getBoardData(roomId)
            boardGameData.canMove = boardGameData.roundPlayerId === userId
            const temp = JSON.parse(JSON.stringify(boardGameData))
            await boardGameData.dataSymbol.forEach(async (e, i) => {
                temp.dataSymbol[i].playerName = await getUserOneWithOutPassword(
                    {
                        userId: e.playerId,
                    }
                ).name
            })
            return responseData(res, 200, temp)
        },
        exitRoom(req, res) { },
        deleteRoom(req, res) { },
    }
}
