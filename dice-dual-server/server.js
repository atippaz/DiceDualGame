import Api from './api/index.js'
import gameServer from './game-server/index.js'
import _mqtt from './mqtt/index.js'

import store from './services/index.js'
import env from 'dotenv'
env.config()

async function startUp() {
    const mqqt = _mqtt()
    const socket = gameServer(store, mqqt)

    Api(socket, store, mqqt)
    await socket.createRoom()
    mqqt.initServiceMqqt(socket, store)
    console.log('success')
}

startUp()
