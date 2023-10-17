import express from 'express'
import { xoGameController } from '../../controllers/index.js'
import { checkToken, convertJwt } from '../../middleware/index.js'
const route = express.Router()
const service = (_socket, store) => {
    const {
        onGetAll,
        createNewRoom,
        onGetById,
        hasRoom,
        joinRoom,
        resumeGame,
        viewRoom,
        startGame,
        getBoardGameById,
    } = xoGameController(_socket, store)

    route.get('/xoGame/getAll', checkToken, convertJwt, onGetAll)
    route.post('/xoGame/createRoom', checkToken, convertJwt, createNewRoom)
    route.get('/xoGame/getRoomId/:roomId', checkToken, convertJwt, onGetById)
    route.post('/xoGame/hasRoom', checkToken, convertJwt, hasRoom)
    route.post('/xoGame/joinRoom', checkToken, convertJwt, joinRoom)
    route.post('/xoGame/resumeGame', checkToken, convertJwt, resumeGame)
    route.get('/xoGame/viewRoom/:roomId', checkToken, convertJwt, viewRoom)
    route.post('/xoGame/startGame', checkToken, convertJwt, startGame)
    route.get(
        '/xoGame/getBoardGameById/:roomId',
        checkToken,
        convertJwt,
        getBoardGameById
    )

    return route
}

export default service
