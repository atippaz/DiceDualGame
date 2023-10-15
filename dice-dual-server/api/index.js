import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes/index.js'
import cors from 'cors'

const server = express()
const port = process.env.PORT_API || 9000

const api = function (socket = null, store = null, mqqt) {
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(cors())

    server.get('/', (req, res) => {
        res.send({ data: 'hi', statusCode: 200 })
    })
    server.get('/openLight', (req, res) => {
        mqqt.openLight()
        res.send({ data: 'hi', statusCode: 200 })
    })
    server.get('/closeLight', (req, res) => {
        mqqt.closeLight()
        res.send({ data: 'hi', statusCode: 200 })
    })
    // server.use(server.use(routes(socket, store)))

    return server.listen(port, (err, result) => {
        console.log('running in port http://localhost:' + port)
    })
}
export default api
