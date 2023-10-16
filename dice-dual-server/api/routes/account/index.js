import express from 'express'
import { accountController } from '../../controllers/index.js'

const route = express.Router()
const service = (_socket, store) => {
    const { registerUser, login } = accountController(_socket, store)
    route.post('/account/register', registerUser)
    route.post('/account/login', login)

    return route
}

export default service
