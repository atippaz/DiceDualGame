import Api from './api/index.js'
import gameServer from './game-server/index.js'
import mqtt from './mqtt/index.js'

import store from './services/index.js'
import env from 'dotenv'
env.config()

function startUp() {
    const mqqt = mqtt()
    const socket = gameServer(store, mqqt)
    Api(socket, store, mqqt)
}

startUp()
