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
                const result = data.map((e) => {
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
                        canJoin:
                            e.maxPlayer >
                                e.players.filter((y) => y.playerId !== null)
                                    .length && !e.started,
                    }
                })

                return responseData(res, 200, result)
            } catch (er) {
                console.log(er)
            }
        },
        createNewRoom: (req, res) => {
            const { roomName } = req.body
            const user = req.user
            const playerId = user.userId
            const playerName = user.name
            const roomData = store.services.room.createNewRoom(
                roomName,
                GameType.XoGame
            )
            if (roomData.status) {
                store.services.xoGame.createBoardGame(roomData.roomId)
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
                return responseData(res, 403, {})
            }
            return responseData(res, 403, {})
        },
        joinRoom: (req, res) => {
            const { roomId } = req.body
            const user = req.user
            const playerId = user.userid
            const playerName = user.name
            if (store.services.room.joinRoom(roomId, playerId, playerName)) {
                const roomData = store.state.room.filter(
                    (x) => x.roomId === roomId
                )
                const boardData = store.state.xoGame.filter(
                    (x) => x.roomId === roomId
                )
                return responseData(res, 200, {
                    roomId: roomId,
                    playerId: playerId,
                    gameData: [...roomData, ...boardData],
                })
            } else {
                if (store.services.room.hasRoom(roomId))
                    return responseData(res, 403, {})
                return responseData(res, 404, {})
            }
        },
        onGetById(req, res) {
            const { roomId } = req.params
            const roomIdx = store.state.room.findIndex(
                (x) => x.roomId === roomId
            )

            if (roomIdx !== -1) {
                return responseData(res, 200, store.state.room[roomIdx])
            } else {
                return responseData(res, 404, {})
            }
        },
    }
}
