import mqtt from 'mqtt'
const mqttServer = () => {
    const client = mqtt.connect('mqtt://broker.hivemq.com:1883')
    let conMove = true
    let isOnline = true
    let looking
    let cooldown = false
    const initServiceMqqt = (socket, store) => {
        if (client) {
            client.on('connect', () => {
                console.log('mqqt Connect to server')
                client.subscribe('sayhi')
                client.subscribe('connect')
                client.subscribe('move')
                client.subscribe('enter')
            })

            client.on('message', (topic, message) => {
                isOnline = true
                store.services.mqqt.setState(true)
                lookUpOnline()

                if (!cooldown) {
                    console.log(
                        `Received message on topic ${topic}: ${message.toString()}`
                    )
                }
                if (topic === 'move') {
                    const id = store.services.socket.getSocketId(
                        store.services.mqqt.getCurrentId()
                    )
                    if (id && conMove) {
                        socket.server
                            .to(id)
                            .emit('controllerMove', message.toString())
                        conMove = false
                        console.log('move ' + message.toString());
                        setTimeout(() => {
                            conMove = true
                        }, 1000)
                    } else {
                        console.log(message.toString() + '  not found')
                    }
                } else if (topic === 'enter') {
                    const id = store.services.socket.getSocketId(
                        store.services.mqqt.getCurrentId()
                    )
                    if (id) {
                        socket.server.to(id).emit('enterMove', 'enter')
                        console.log('send enter');
                    } else {
                        console.log('not found')
                    }
                } else if (topic === 'sayhi' && !cooldown) {
                    cooldown = true
                    store.services.mqqt.setState(true)
                    const data = store.services.mqqt.getInfo()
                    socket.server.emit('mqqtStateInUse', {
                        state: data.idController === null && data.isOnline,
                        isOnline: data.isOnline,
                        playerOwner: data.idController,
                    })
                    setTimeout(() => {
                        cooldown = false
                    }, 10000);
                } else if (topic === 'connect') {
                    // check your data
                }
            })
            lookUpOnline()
            function lookUpOnline() {
                // console.log('check esp32 is online ?');
                if (!looking) {
                    console.log('checking esp32 . . .');
                    looking = setInterval(() => {
                        isOnline = false
                        setTimeout(() => {
                            if (!isOnline) {
                                console.log('esp32 offine');
                                store.services.mqqt.setState(false)
                                const data = store.services.mqqt.getInfo()
                                socket.server.emit('mqqtStateInUse', {
                                    state: data.idController === null && data.isOnline,
                                    isOnline: data.isOnline,
                                    playerOwner: data.idController,
                                })
                                clearInterval(looking)
                                looking = null
                            }
                            else {
                                console.log('esp32 is online');
                                const data = store.services.mqqt.getInfo()
                                socket.server.emit('mqqtStateInUse', {
                                    state: data.idController === null && data.isOnline,
                                    isOnline: data.isOnline,
                                    playerOwner: data.idController,
                                })
                            }
                        }, 5000);
                    }, 5000);
                }
            }

            client.on('offline', () => {
                console.log('Disconnected from MQTT broker')
                store.services.mqqt.setState(false)
            })
        }
    }
    return {
        enemyTurn: () => {
            console.log('esp32 enemy turn')
            client.publish('esp32', 'enemyturn')
        },
        yourTurn: () => {
            console.log('esp32 your turn')
            client.publish('esp32', 'yourturn')
        },
        yourWin: () => {
            console.log('esp32 your win')
            client.publish('esp32', 'yourwin')
        },
        yourLose: () => {
            console.log('esp32 your lose')
            client.publish('esp32', 'yourlose')
        },
        draw: () => {
            console.log('esp32 draw')
            client.publish('esp32', 'draw')
        },
        initServiceMqqt: initServiceMqqt,
    }
}

export default mqttServer
