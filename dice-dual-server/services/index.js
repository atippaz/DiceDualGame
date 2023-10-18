import { roomState, roomServices } from './room/room.js'
import { xoGameState, xoGameService } from './xoGame/index.js'
function cleanData() {
    roomServices.getRoomIsNotActive().forEach((e) => {
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
    },
    services: {
        room: roomServices,
        xoGame: xoGameService,
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
