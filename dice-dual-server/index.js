import Api from './api/index.js'
import gameServer from './game-server/index.js'
import mqtt from './mqtt/index.js'

import store from './services/index.js'
import env from 'dotenv'
env.config()

function startUp() {
    const socket = gameServer(store)
    const mqqt = mqtt()
    Api(socket, store, mqqt)
    setInterval(() => {
        socket.sayHi()
    }, 1000)
}

startUp()
