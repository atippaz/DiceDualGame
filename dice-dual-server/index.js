import Api from './api/index.js'
import gameServer from './game-server/index.js'
import store from './services/index.js'
import env from 'dotenv'
env.config()

function startUp() {
    const socket = gameServer(store)
    Api(socket, store)
    setInterval(() => {
        socket.sayHi()
    }, 1000)
}

startUp()
