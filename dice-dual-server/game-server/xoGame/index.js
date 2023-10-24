import { createResponseObj } from '../../helpers/index.js'
import { getUserOneWithOutPassword } from '../../api/service/user.js'
const xoSocket = (store, socket, mqqt) => {
    return {
        startServer: () => {
            socket.on('connection', (_socket) => {
                _socket.on('joinRoom', ({ roomId, playerId }) => {
                    if (playerId) {
                        _socket.join(roomId)
                        console.log(`user : ${playerId} has join`)
                        _socket.userId = playerId
                        store.services.socket.addSocketData(
                            _socket.id,
                            playerId
                        )
                        socket
                            .to(roomId)
                            .except(_socket.id)
                            .emit('joinRoom', `สวัสดีทุกคน! ฉัน ${playerId}`)
                    }
                })
                _socket.on('disconnect', () => {
                    if (_socket.userId) {
                        store.services.socket.addSocketData(
                            _socket.id,
                            _socket.userId
                        )
                        console.log(`${_socket.userId} disconnected`)
                    }
                })
                _socket.on('requestGameData', (roomId) => {
                    const { room } = store.services
                    const response = room.getDataRoomGame(
                        roomId,
                        _socket.userId
                    )
                    if (response !== null) {
                        socket
                            .to(_socket.id)
                            .emit(
                                'roomGameData',
                                createResponseObj(200, response)
                            )
                        socket
                            .to(roomId)
                            .except(_socket.id)
                            .emit(
                                'getRequestRoom',
                                createResponseObj(200, { message: 'getData' })
                            )
                    }
                })
                _socket.on('getRequestGameData', (roomId) => {
                    const { room } = store.services
                    const response = room.getDataRoomGame(
                        roomId,
                        _socket.userId
                    )
                    if (response !== null) {
                        return socket
                            .to(_socket.id)
                            .emit(
                                'getRequestGameData',
                                createResponseObj(200, response)
                            )
                    }
                })
                _socket.on('leaveRoom', (roomId) => {
                    _socket.leave(roomId)
                    console.log(`${_socket.userId} leave room`)
                    // store.services.socket.addSocketData(
                    //     _socket.id,
                    //     _socket.userId
                    // )
                    //remove
                    socket.to(_socket.id).emit('leaveRoom', null)
                })
                _socket.on('requestBoardGameData', async (roomId) => {
                    const { xoGame } = store.services
                    const boardData = xoGame.getBoardData(roomId)
                    const playerId = _socket.userId
                    boardData.canMove = boardData.roundPlayerId === playerId
                    if (boardData != null) {
                        const temp = JSON.parse(JSON.stringify(boardData))
                        await boardData.dataSymbol.forEach(async (e, i) => {
                            temp.dataSymbol[i].playerName =
                                await getUserOneWithOutPassword({
                                    userId: e.playerId,
                                }).name
                        })
                        return socket
                            .to(_socket.id)
                            .emit('boardGameData', createResponseObj(200, temp))
                    }
                    return socket.to(_socket.id).emit('boardGameData', null)
                })
                _socket.on('requestGetBoardGame', (roomId) => {
                    socket
                        .to(roomId)
                        .except(_socket.id)
                        .emit('getBoardGame', createResponseObj(200, roomId))
                })

                _socket.on('getBoardGame', async (roomId) => {
                    const { xoGame } = store.services
                    const playerId = _socket.userId
                    const boardData = xoGame.getBoardData(roomId)
                    boardData.canMove = boardData.roundPlayerId === playerId
                    const temp = JSON.parse(JSON.stringify(boardData))
                    await boardData.dataSymbol.forEach(async (e, i) => {
                        temp.dataSymbol[i].playerName =
                            await getUserOneWithOutPassword({
                                userId: e.playerId,
                            }).name
                    })
                    if (temp != null) {
                        return socket
                            .to(_socket.id)

                            .emit('boardGameData', createResponseObj(200, temp))
                    }
                    return socket
                        .to(_socket.id)
                        .emit('boardGameData', createResponseObj(404, null))
                })
                _socket.on('move', async (payload) => {
                    const { roomId, target } = payload
                    const { xoGame, room } = store.services
                    const playerId = _socket.userId
                    const boardData = xoGame.getBoardData(roomId)
                    const reveaseData = JSON.parse(JSON.stringify(boardData))
                    const roomData = room.getRoomData(roomId)
                    try {
                        if (
                            boardData != null &&
                            boardData.roundPlayerId === playerId &&
                            roomData.players.some(
                                (e) => e.playerId === playerId
                            )
                        ) {
                            const moveState = xoGame.makeMove(
                                roomId,
                                target,
                                playerId
                            )
                            if (moveState.moved) {
                                if (boardData.gameOver) {
                                    // statement game over
                                    socket.to(roomId).emit(
                                        'updateBoardCell',
                                        createResponseObj(200, {
                                            target: target,
                                            value: boardData.dataSymbol.find(
                                                (e) => e.playerId === playerId
                                            ).symbol,
                                        })
                                    )
                                    socket
                                        .to(roomId)
                                        .emit(
                                            'updateRoundPlayer',
                                            createResponseObj(200, null)
                                        )
                                    socket.to(roomId).emit(
                                        'gameOver',
                                        createResponseObj(200, {
                                            isDraw: moveState.symbol === 'draw',
                                            playerId: playerId,
                                        })
                                    )
                                    room.removeOwner(roomId)
                                    return
                                } else {
                                    const playerindex =
                                        boardData.dataSymbol.findIndex(
                                            (e) =>
                                                e.playerId ===
                                                boardData.roundPlayerId
                                        )
                                    if (
                                        playerindex <
                                        boardData.dataSymbol.length - 1
                                    ) {
                                        boardData.roundPlayerId =
                                            boardData.dataSymbol[
                                                playerindex + 1
                                            ].playerId
                                    } else {
                                        boardData.roundPlayerId =
                                            boardData.dataSymbol[0].playerId
                                    }
                                    socket.to(roomId).emit(
                                        'updateBoardCell',
                                        createResponseObj(200, {
                                            target: target,
                                            value: boardData.dataSymbol.find(
                                                (e) => e.playerId === playerId
                                            ).symbol,
                                        })
                                    )
                                    if (mqqt.getId() != null) {
                                        mqqt.getId() === boardData.roundPlayerId
                                            ? mqqt.closeLight()
                                            : mqqt.openLight()
                                    }

                                    socket
                                        .to(roomId)
                                        .emit(
                                            'updateRoundPlayer',
                                            createResponseObj(
                                                200,
                                                boardData.roundPlayerId
                                            )
                                        )
                                    return
                                }
                            } else {
                                // emit to youeself can't move na
                                socket
                                    .to(_socket.id)
                                    .emit(
                                        'canNotMove',
                                        createResponseObj(200, null)
                                    )
                                // room.removeOwner(roomId)
                                boardData = reveaseData
                            }
                            return
                        }
                    } catch (er) {
                        xoGame.assignDataToRoom(roomId, reveaseData)
                        console.error(er)
                    }
                })
            })
        },
    }
}
export default xoSocket
