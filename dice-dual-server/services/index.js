import { roomState, roomServices } from './room/room.js'
import { xoGameState, xoGameService } from './xoGame/index.js'

export default {
    state: {
        room: roomState,
        xoGame: xoGameState,
    },
    services: {
        room: roomServices,
        xoGame: xoGameService,
    },
}
