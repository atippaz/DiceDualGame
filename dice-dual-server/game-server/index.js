import { Server as SocketIOServer } from 'socket.io'
import express from 'express'
import cors from 'cors'
import xoGame from './xoGame/index.js'
import chat from './chatRoom/index.js'
import mqtt from './mqttControl/index.js'

const initial = (store, mqqt) => {
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
        transports: ["polling", "websocket"],
    })
    let initSocket = false
    let initChatRoom = false
    mqtt(store, gameServer, mqtt).startServer()
    return {
        createRoom: () => {

            return new Promise((resolve, reject) => {
                {
                    if (!initSocket) {
                        xoGame(store, gameServer, mqqt, resolve).startServer()
                        initSocket = true
                    }
                    else {
                        resolve()
                    }
                }
            })
        },
        createChatRoom: () => {
            if (!initChatRoom) {
                chat(store, gameServer).startServer()
                initChatRoom = true
            }
        },
    }
}
export default initial
