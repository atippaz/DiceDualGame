import { Server as SocketIOServer } from 'socket.io'
import express from 'express'
import cors from 'cors'

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
    gameServer.on('diceMove', ({ dice: { value }, playerId }) => { })
    return {
        sendData(msg) {
            gameServer.emit('sendData', msg)
        },
        sayHi() {
            const d = new Date()
            gameServer.emit(
                'sayhi',
                `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} : ${d
                    .getHours()
                    .toString()
                    .padStart(2, '0')} : ${d
                        .getMinutes()
                        .toString()
                        .padStart(2, '0')}: ${d
                            .getSeconds()
                            .toString()
                            .padStart(2, '0')}`
            )
        },
    }
}
export default initial
