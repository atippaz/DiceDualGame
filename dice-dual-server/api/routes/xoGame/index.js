import express from 'express'
import { xoGameController } from '../../controllers/index.js'
import { checkToken } from '../../middleware/index.js'
const route = express.Router()
const controllerName = '/xoGame'
const service = (_socket, store, mqqt) => {
    const {
        onGetAll,
        onGetCurrentRoom,
        createNewRoom,
        onGetById,
        hasRoom,
        joinRoom,
        resumeGame,
        viewRoom,
        startGame,
        getBoardGameById,
        exitRoom,
        deleteRoom,
    } = xoGameController(_socket, store, mqqt)

    route.get(`${controllerName}/getAll`, checkToken, onGetAll)
    route.get(
        `${controllerName}/getCurrentRoom`,
        checkToken,
        onGetCurrentRoom
    )

    route.post(
        `${controllerName}/createRoom`,
        checkToken,

        createNewRoom
    )
    route.get(
        `${controllerName}/getRoomId/:roomId`,
        checkToken,

        onGetById
    )
    route.post(`${controllerName}/hasRoom`, checkToken, hasRoom)
    route.post(`${controllerName}/joinRoom`, checkToken, joinRoom)
    route.post(
        `${controllerName}/resumeGame`,
        checkToken,

        resumeGame
    )
    route.get(
        `${controllerName}/viewRoom/:roomId`,
        checkToken,
        viewRoom
    )
    route.post(`${controllerName}/startGame`, checkToken, startGame)
    route.get(
        `${controllerName}/getBoardGameById/:roomId`,
        checkToken,

        getBoardGameById
    )
    route.post(`${controllerName}/exitRoom`, checkToken, exitRoom)
    route.post(
        `${controllerName}/deleteRoom`,
        checkToken,

        deleteRoom
    )

    return route
}

export default service
