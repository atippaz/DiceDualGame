import SocketInstance from './initial'
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
    canNotMove: (data: string) => void,
    handleKeyPress: (data: string) => void
) => {
    const context = getContext().inject(contextPluginSymbol)!
    let socket: Socket
    let socketHasInit = false
    let socketMapOnListeningEvent: Array<{ nameEvent: string; fn: Function }> =
        []
    const socketMapOnListeningEventInit = (
        roomId: string,
        isStart: boolean
    ) => {
        socketHasInit = true
        socketMapOnListeningEvent = [
            {
                nameEvent: 'roomGameData',
                fn: (data: any) => {
                    roomGameData(data.data)
                },
            },
            {
                nameEvent: 'joinRoom',
                fn: (data: any) => {
                    joinRoom(data)
                    if (!isStart) {
                        //
                        socket.emit('requestGameData', roomId)
                    } else {
                        //
                        socket.emit('requestBoardGameData', roomId)
                    }
                },
            },
            {
                nameEvent: 'getRequestRoom',
                fn: (data: any) => {
                    socket.emit('getRequestGameData', roomId)
                },
            },
            {
                nameEvent: 'getRequestGameData',
                fn: (data: any) => {
                    roomGameData(data.data)
                },
            },
            {
                nameEvent: 'boardGameData',
                fn: (data: any) => {
                    getBoardGameData(data.data)
                },
            },
            {
                nameEvent: 'updateBoardCell',
                fn: (data: any) => {
                    updateBoardCell(data.data)
                },
            },
            {
                nameEvent: 'getBoardGame',
                fn: (data: any) => {
                    socket.emit('getBoardGame', data.data)
                },
            },
            {
                nameEvent: 'gameOver',
                fn: (data: any) => {
                    if (data.statusCode === 200) {
                        gameOver(data.data)
                    }
                },
            },
            {
                nameEvent: 'updateRoundPlayer',
                fn: (data: any) => {
                    updateRoundPlayer(data.data)
                },
            },
            {
                nameEvent: 'canNotMove',
                fn: (data: any) => {
                    if (data.statusCode === 200) {
                        canNotMove(data)
                    }
                },
            },
            {
                nameEvent: 'leaveRoom',
                fn: (data: any) => {
                    resetSocket()
                },
            },
            {
                nameEvent: 'controllerMove',
                fn: (data: any) => {
                    handleKeyPress(data)
                },
            },
            {
                nameEvent: 'enterMove',
                fn: (data: any) => {
                    handleKeyPress('enter')
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
        join: (roomId: string, isStart: boolean) => {
            if (!socket) {
                socket = SocketInstance().socket
                socket.emit('joinRoom', {
                    roomId,
                    playerId: context.userId.value,
                })
                socketMapOnListeningEventInit(roomId, isStart)

                socketMapOnListeningEvent.forEach((e) =>
                    socket.on(e.nameEvent, (data) => e.fn(data))
                )
            }
        },
        callAllUserGetBoardGameData(roomId: string) {
            if (socket !== null && socketHasInit)
                socket.emit('requestGetBoardGame', roomId)
        },

        move(
            roomId: string,
            target: { row: number | string; col: number | string }
        ) {
            if (socket !== null && socketHasInit)
                socket.emit('move', { roomId, target })
        },
        leaveRoom(roomId: string) {
            if (socket !== null && socketHasInit) {
                socket.emit('leaveRoom', roomId)
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
