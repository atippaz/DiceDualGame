import express from 'express'
import { xoGameController } from '../../controllers/index.js'
import { checkToken, convertJwt } from '../../middleware/index.js'
const route = express.Router()
const controllerName = '/xoGame'
const service = (_socket, store) => {
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
    } = xoGameController(_socket, store)

    route.get(`${controllerName}/getAll`, checkToken, convertJwt, onGetAll)
    route.get(
        `${controllerName}/getCurrentRoom`,
        checkToken,
        convertJwt,
        onGetCurrentRoom
    )

    route.post(
        `${controllerName}/createRoom`,
        checkToken,
        convertJwt,
        createNewRoom
    )
    route.get(
        `${controllerName}/getRoomId/:roomId`,
        checkToken,
        convertJwt,
        onGetById
    )
    route.post(`${controllerName}/hasRoom`, checkToken, convertJwt, hasRoom)
    route.post(`${controllerName}/joinRoom`, checkToken, convertJwt, joinRoom)
    route.post(
        `${controllerName}/resumeGame`,
        checkToken,
        convertJwt,
        resumeGame
    )
    route.get(
        `${controllerName}/viewRoom/:roomId`,
        checkToken,
        convertJwt,
        viewRoom
    )
    route.post(`${controllerName}/startGame`, checkToken, convertJwt, startGame)
    route.get(
        `${controllerName}/getBoardGameById/:roomId`,
        checkToken,
        convertJwt,
        getBoardGameById
    )
    route.post(`${controllerName}/exitRoom`, checkToken, convertJwt, exitRoom)
    route.post(
        `${controllerName}/deleteRoom`,
        checkToken,
        convertJwt,
        deleteRoom
    )

    return route
}

export default service
