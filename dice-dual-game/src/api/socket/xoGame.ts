import SocketInstance from './index'
import { contextPluginSymbol } from '@/plugins/context'
import { getContext } from '@/context'
import { type Socket } from 'socket.io-client'

export default (
    joinRoom: (mes: string) => void,
    roomGameData: (data: any) => void,
    getBoardGameData: (data: any) => void
) => {
    const context = getContext().inject(contextPluginSymbol)!
    let socket: Socket
    return {
        join: (roomId: string, isStart: boolean) => {
            socket = SocketInstance().socket
            socket.emit('joinRoom', { roomId, playerId: context.userId.value })
            socket.on('joinRoom', (message) => {
                joinRoom(message)
                if (!isStart) {
                    socket.emit('requestGameData', roomId)
                } else {
                    console.log('sdasd');

                    socket.emit('requestBoardGameData', roomId)
                }
            })
            socket.on('roomGameData', (data) => {
                console.log('roomGameData', data)
                roomGameData(data)
            })
            socket.on('getRequestRoom', (mes) => {
                console.log('getRequestRoom', 'emit to getRequest New Data')
                socket.emit('getRequestGameData', roomId)
            })
            socket.on('getRequestGameData', (data) => {
                console.log('getRequestGameData', data)
                roomGameData(data)
            })
            socket.on('boardGameData', (data) => {
                getBoardGameData(data)
            })
        },
        callAllUserGetBoardGameData(roomId: string) {
            socket.emit('requestGetBoardGame', roomId)
        },
    }
}
