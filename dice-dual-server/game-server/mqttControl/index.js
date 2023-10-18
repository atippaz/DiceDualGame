import { createResponseObj } from '../../helpers/index.js'
const mqttSocket = (store, socket, mqtt) => {
    const controller = 'mqtt'
    console.log('mqtt socket Start')
    return {
        startServer: () => {
            socket.on('connection', (_socket) => {
                console.log('connect to mqtt')
                _socket.on(`${controller}/joinRoom`, ({ roomId, playerId }) => {
                    _socket.join(roomId)
                    console.log(`user : ${playerId} has join`)
                    _socket.userId = playerId
                    socket
                        .to(roomId)
                        .except(_socket.id)
                        .emit('joinRoom', `สวัสดีทุกคน! ฉัน ${playerId}`)
                })
                _socket.on('mqttState', (data) => {
                    socket.emit('mqttState', mqtt.getId() === null)
                })
                _socket.on(`${controller}/disconnect`, () => {
                    console.log(`${_socket.userId} disconnected`)
                })
            })
        },
    }
}
export default mqttSocket
