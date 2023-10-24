import SocketInstance from './initial'
import { contextPluginSymbol } from '@/plugins/context'
import { getContext } from '@/context'
import { type Socket } from 'socket.io-client'

export default (
    mqqtStateHandle: (
        state: boolean,
        playerOwner: string | null,
        isOnline: boolean
    ) => void
) => {
    const context = getContext().inject(contextPluginSymbol)!
    let socket: Socket
    let socketHasInit = false
    let socketMapOnListeningEvent: Array<{ nameEvent: string; fn: Function }> =
        []
    const socketMapOnListeningEventInit = () => {
        socketHasInit = true
        socketMapOnListeningEvent = [
            {
                nameEvent: 'mqqtStateInUse',
                fn: (data: {
                    state: boolean
                    isOnline: boolean
                    playerOwner: string | null
                }) => {
                    console.log('socket in use: ' + data)
                    const { state, playerOwner, isOnline } = data
                    mqqtStateHandle(state, playerOwner, isOnline)
                },
            },
        ]
    }
    function resetSocket() {
        socket.disconnect()
    }
    return {
        resetSocket: () => {
            resetSocket()
        },
        connect: () => {
            if (!socket) {
                socket = SocketInstance().socket
                socketMapOnListeningEventInit()
                socketMapOnListeningEvent.forEach((e) =>
                    socket.on(e.nameEvent, (data) => e.fn(data))
                )
                socket.emit('requestMqqtState')
            }
        },
        useMqqt: (playerId: string) => {
            if (socket && socketHasInit) socket.emit('useMqqt', playerId)
        },
        unUseMqqt: () => {
            if (socket && socketHasInit) socket.emit('unUseMqqt', true)
        },
        leave() {
            if (socket && socketHasInit) {
                console.log('removeing event listening')
                socketHasInit = false
                for (const event of socketMapOnListeningEvent) {
                    socket.off(event.nameEvent, () => event.fn)
                }
            } else {
                console.log('socket do not init')
            }
        },
    }
}