import SocketInstance from './index'
import { contextPluginSymbol } from '@/plugins/context'
import { getContext } from '@/context'
import { type Socket } from 'socket.io-client'

export default (
    joinRoom: (mes: string) => void,
    roomGameData: (data: any) => void,
    getBoardGameData: (data: any) => void,
    updateBoardCell: (data: any) => void,
    updateRoundPlayer: (data: string) => void,
    gameOver: (data: string) => void,
    canNotMove: (data: string) => void
) => {
    const context = getContext().inject(contextPluginSymbol)!
    let socket: Socket
    function resetSocket() {
        socket.disconnect()
    }
    return {
        resetSocket: () => {
            resetSocket()
        },
        join: (roomId: string, isStart: boolean) => {
            if (socket !== null) {
                socket = SocketInstance().socket
                socket.emit('joinRoom', {
                    roomId,
                    playerId: context.userId.value,
                })
                socket.on('joinRoom', (message) => {
                    joinRoom(message)
                    if (!isStart) {
                        //
                        socket.emit('requestGameData', roomId)
                    } else {
                        //
                        socket.emit('requestBoardGameData', roomId)
                    }
                })
                socket.on('roomGameData', (data) => {
                    roomGameData(data.data)
                })
                socket.on('getRequestRoom', (mes) => {
                    socket.emit('getRequestGameData', roomId)
                })
                socket.on('getRequestGameData', (data) => {
                    roomGameData(data.data)
                })
                socket.on('boardGameData', (data) => {
                    getBoardGameData(data.data)
                })
                socket.on('updateBoardCell', (data) => {
                    updateBoardCell(data.data)
                })
                socket.on('getBoardGame', (data) => {
                    socket.emit('getBoardGame', data.data)
                })
                socket.on('updateRoundPlayer', (data) => {
                    updateRoundPlayer(data.data)
                })
                socket.on('gameOver', (data) => {
                    if (data.statusCode === 200) {
                        gameOver(data.data)
                    }
                })
                socket.on('canNotMove', (data) => {
                    if (data.statusCode === 200) {
                        canNotMove(data)
                    }
                })
                socket.on('leaveRoom', (data) => {
                    resetSocket()
                })
            }
        },
        callAllUserGetBoardGameData(roomId: string) {
            if (socket !== null) socket.emit('requestGetBoardGame', roomId)
        },

        move(
            roomId: string,
            target: { row: number | string; col: number | string }
        ) {
            if (socket !== null) socket.emit('move', { roomId, target })
        },
        leaveRoom(roomId: string) {
            if (socket !== null) socket.emit('leaveRoom', roomId)
        },
    }
}
