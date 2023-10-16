const xoSocket = (store, socket) => {
    socket.on('xoTest', (mes) => {
        console.log(mes)
    })
    return {}
}
export default xoSocket
