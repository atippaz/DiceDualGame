import express from 'express'
import room from './room/index.js'
const route = express.Router()
const service = (_socket = null, store = null) => {
    route.use(room(_socket, store))
    return route
}

export default service
