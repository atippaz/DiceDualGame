import express from 'express'
import { roomController } from '../../controllers/index.js'

import { checkToken } from '../../middleware/index.js'
const route = express.Router()
const service = (_socket, store) => {
    const { onGetAll, createNewRoom, onGetById } = roomController(
        _socket,
        store
    )
    route.get('/gameRoom', checkToken, onGetAll)
    route.post('/gameRoom', checkToken, createNewRoom)
    route.get('/gameRoom/:roomId', checkToken, onGetById)
    return route
}

export default service
