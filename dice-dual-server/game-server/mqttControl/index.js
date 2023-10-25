import { createResponseObj } from '../../helpers/index.js'
const mqttSocket = (store, socket, mqtt) => {
    const controller = 'mqtt'
    return {
        startServer: () => {
            socket.on('connection', (_socket) => {
                console.log('mqtt socket Start')
                _socket.on(`requestMqqtState`, () => {
                    console.log('req');
                    const data = store.services.mqqt.getInfo()
                    socket.to(_socket.id).emit('mqqtStateInUse', {
                        state: data.idController === null && data.isOnline,
                        isOnline: data.isOnline,
                        playerOwner: data.idController,
                    })
                })
                _socket.on('useMqqt', (playerId) => {
                    store.services.mqqt.assignControllerId(playerId)
                    const data = store.services.mqqt.getInfo()

                    socket.emit('mqqtStateInUse', {
                        state: data.idController === null && data.isOnline,
                        isOnline: data.isOnline,
                        playerOwner: data.idController,
                    })
                })
                _socket.on(`unUseMqqt`, (nu) => {
                    store.services.mqqt.removeControllerId()
                    const data = store.services.mqqt.getInfo()
                    socket.emit('mqqtStateInUse', {
                        state: data.idController === null && data.isOnline,
                        isOnline: data.isOnline,
                        playerOwner: data.idController,
                    })
                })
            })
        },
    }
}
export default mqttSocket
