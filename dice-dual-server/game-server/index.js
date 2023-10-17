import { Server as SocketIOServer } from 'socket.io'
import express from 'express'
import cors from 'cors'
import xoGame from './xoGame/index.js'

const initial = (store) => {
    const server = express()
    const port = process.env.PORT_GAME_SERVER || 888
    server.use(cors())
    const app = server.listen(port, function (err, result) {
        console.log('running in socket port http://localhost:' + port)
    })
    const gameServer = new SocketIOServer(app, {
        cors: {
            origin: '*',
        },
    })
    let initSocket = false
    // gameServer.on('diceMove', ({ dice: { value }, playerId }) => {})
    return {
        createRoom: () => {
            if (!initSocket) {
                xoGame(store, gameServer).startServer()
                initSocket = true
            }
        },
    }
}
export default initial
