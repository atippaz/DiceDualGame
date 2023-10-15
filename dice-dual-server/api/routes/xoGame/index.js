import express from 'express'
import { xoGameController } from '../../controllers/index.js'

const route = express.Router()
const service = (_socket, store) => {
    // const { onGetAll, createNewRoom, onGetById } = xoGameController(_socket, store)
    // route.get('/gameRoom', onGetAll)
    // route.post('/gameRoom', createNewRoom)
    // route.get('/gameRoom/:roomId', onGetById)
    return route
}

export default service
