import express from 'express'
import room from './room/index.js'
import xoGame from './xoGame/index.js'
import account from './account/index.js'

const route = express.Router()
const service = (_socket = null, store = null, mqqt) => {
    route.use(room(_socket, store))
    route.use(xoGame(_socket, store, mqqt))
    route.use(account(_socket, store))
    return route
}

export default service
