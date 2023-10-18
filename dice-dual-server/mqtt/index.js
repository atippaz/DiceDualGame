import mqtt from 'mqtt'
const mqttServer = () => {
    const idPlayerUserEsp = null
    const client = mqtt.connect('mqtt://broker.hivemq.com:1883')
    client.on('connect', () => {
        console.log('connext')
        client.subscribe('yourTopic') // ตั้งค่าหัวข้อที่ต้องการรับข้อมูล
    })

    client.on('message', (topic, message) => {
        // รับข้อมูลจาก MQTT server และทำสิ่งที่คุณต้องการ
        console.log(`Received message on topic ${topic}: ${message.toString()}`)
    })

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
    }
}

export default mqttServer
