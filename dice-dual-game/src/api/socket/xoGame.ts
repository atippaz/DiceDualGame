import Socket from './index'
import { contextPluginSymbol } from '@/plugins/context'
import { getContext } from '@/context'
export default (
    joinRoom: (mes: string) => void,
    roomGameData: (data: any) => void
) => {
    const context = getContext().inject(contextPluginSymbol)!
    return {
        join: (roomId: string) => {
            const socket = Socket().socket
            socket.emit('joinRoom', { roomId, playerId: context.userId.value })
            socket.on('joinRoom', (message) => {
                joinRoom(message)
                socket.emit('requestGameData', roomId)
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
        },
    }
}
