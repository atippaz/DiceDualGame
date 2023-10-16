import express from 'express'
import { roomController } from '../../controllers/index.js'

import { checkToken, convertJwt } from '../../middleware/index.js'
const route = express.Router()
const service = (_socket, store) => {
    const { onGetAll, createNewRoom, onGetById } = roomController(
        _socket,
        store
    )
    route.get('/gameRoom', checkToken, convertJwt, onGetAll)
    route.post('/gameRoom', checkToken, convertJwt, createNewRoom)
    route.get('/gameRoom/:roomId', checkToken, convertJwt, onGetById)
    return route
}

export default service
