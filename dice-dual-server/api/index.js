import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes/index.js'
import cors from 'cors'
import config from './config.js'
const server = express()
const port = process.env.PORT_API || 9000
const api = async function (socket = null, store = null, mqqt) {
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(cors({ origin: ['*.atipnasakun.online'] }))

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
    server.get('/emergencyCleanData', (req, res) => {
        store.function.cleanData()
        res.status(200).json('ok')
    })
    server.get('/emergencyGetAllData', (req, res) => {
        res.status(200).json(store.function.getAll())
    })
    server.use(routes(socket, store))

    return server.listen(port, async (err, result) => {
        try {
            config()
                .then(() => {
                    console.log('db has Connect!')
                })
                .catch((er) => {
                    console.log(er)
                })
        } catch (er) {
            console.log(er)
        }
        finally {
            console.log('running in port http://localhost:' + port)
        }
    })
}
export default api
