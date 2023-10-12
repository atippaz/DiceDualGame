import Api from './api/index.js'
import gameServer from './game-server/index.js'
import store from './store/index.js'
import env from 'dotenv'
env.config()

function startUp() {
    gameServer(store)
    Api(gameServer, store)
}

startUp()
