import mqtt from 'mqtt'
const mqttServer = () => {
    const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
    client.on('connect', () => {
        console.log('connext');
        client.subscribe('yourTopic'); // ตั้งค่าหัวข้อที่ต้องการรับข้อมูล
    });

    client.on('message', (topic, message) => {
        // รับข้อมูลจาก MQTT server และทำสิ่งที่คุณต้องการ
        console.log(`Received message on topic ${topic}: ${message.toString()}`);
    });

    return {
        openLight: () => {
            client.publish('esp32', 'openLight');
            console.log('openLight');
        },
        closeLight: () => {
            client.publish('esp32', 'closeLight');
            console.log('closeLight');
        }
    }
}

export default mqttServer