import mqtt from 'mqtt'
const mqttServer = () => {
    const idPlayerUserEsp = null
    const client = mqtt.connect('mqtt://broker.hivemq.com:1883')
    let conMove = true
    const initServiceMqqt = (socket, store) => {
        if (client) {
            client.on('connect', () => {
                console.log('connext')
                client.subscribe('yourTopic')
                client.subscribe('move')
                client.subscribe('enter')

            })

            client.on('message', (topic, message) => {
                // รับข้อมูลจาก MQTT server และทำสิ่งที่คุณต้องการ
                console.log(`Received message on topic ${topic}: ${message.toString()}`)
                console.log(store.services.mqqt.getCurrentId());
                if (topic === 'move') {
                    const id = store.services.socket.getSocketId(store.services.mqqt.getCurrentId())
                    if (id && conMove) {
                        socket.server.to(id).emit('controllerMove', message.toString())
                        conMove = false
                        setTimeout(() => {
                            conMove = true
                        }, 1000);
                    }
                    else {
                        console.log('not found');
                    }
                }
                else if (topic === 'enter') {
                    const id = store.services.socket.getSocketId(store.services.mqqt.getCurrentId())
                    if (id) {
                        socket.server.to(id).emit('enterMove', 'enter')
                    }
                    else {
                        console.log('not found');
                    }
                }
            })
        }
    }
    return {
        updateId: (playerId) => {
            idPlayerUserEsp = playerId
        },
        getId: () => {
            return idPlayerUserEsp
        },
        deleteId: () => {
            idPlayerUserEsp = null
        },
        openLight: () => {
            console.log('esp32 enemy turn')
            client.publish('esp32', 'openLight')
        },
        closeLight: () => {
            console.log('esp32 your turn')
            client.publish('esp32', 'closeLight')
        },
        initServiceMqqt: initServiceMqqt
    }
}

export default mqttServer
