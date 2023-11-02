import { Server as SocketIOServer } from 'socket.io'
import express from 'express'
import cors from 'cors'
import xoGame from './xoGame/index.js'
import chat from './chatRoom/index.js'
import Mqtt from './mqttControl/index.js'
import middleWare from './middleware/index.js'

const initial = (store, mqqt) => {
    const server = express()
    const port = process.env.PORT_GAME_SERVER || 888
    server.use(cors())
    server.use(middleWare)
    let initMqqt = false

    const app = server.listen(port, function (err, result) {
        console.log('running in socket port http://localhost:' + port)
        if (!initMqqt) {
            initMqqt = true
            Mqtt(store, gameServer, mqqt).startServer()
        }
    })
    const gameServer = new SocketIOServer(app, {
        cors: {
            origin: '*.atipnasakun.online',
        },
        transports: ['polling', 'websocket'],
    })
    let initSocket = false

    let initChatRoom = false
    return {
        createRoom: () => {
            console.log('start socket init')
            if (!initSocket) {
                xoGame(store, gameServer, mqqt).startServer()
                initSocket = true
            }
        },
        createChatRoom: () => {
            if (!initChatRoom) {
                chat(store, gameServer).startServer()
                initChatRoom = true
            }
        },
        server: gameServer
    }
}
export default initial
