import { roomState, roomServices } from './room/room.js'
import { xoGameState, xoGameService } from './xoGame/index.js'
import { mqqtService, mqqtState } from './mqqt/index.js'
import { socketService, socketState } from './socket/index.js'

function cleanData() {
    roomServices.getRoomAll().forEach((e) => {
        roomServices.deleteRoom(e)
        xoGameService.removeBoard(e)
    })
}
setInterval(
    () => {
        console.log('delete data')
        cleanData
    },
    1000 * 60 * 24
)
export default {
    state: {
        room: roomState,
        xoGame: xoGameState,
        mqqt: mqqtState,
        socket: socketState
    },
    services: {
        room: roomServices,
        xoGame: xoGameService,
        mqqt: mqqtService,
        socket: socketService
    },
    function: {
        cleanData,
        getAll: () => {
            return {
                room: roomState,
                xoGame: xoGameState,
            }
        },
    },
}
