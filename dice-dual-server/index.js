import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes/index.js'
import cors from 'cors'
import socket from './socket/index.js'
const server = express()
const port = 9000
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

server.get('/', (req, res) => {
    res.end('hi what sub')
})
server.use(cors())

const app = server.listen(port, function (err, result) {
    console.log('running in port http://localhost:' + port)
})
const socketObj = socket(app)
server.use(routes(socketObj).app)

export { app, socketObj }
