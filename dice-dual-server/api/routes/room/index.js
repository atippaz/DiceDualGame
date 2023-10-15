import express from 'express'
import room from '../../controllers/room/index.js'

const route = express.Router()
const service = (_socket, store) => {

    const { onGetAll, createNewRoom, onGetById } = room(_socket, store)
    route.get('/gameRoom', onGetAll)
    route.post('/gameRoom', createNewRoom)
    route.get('/gameRoom/:roomId', onGetById)
    return route
}

export default service
