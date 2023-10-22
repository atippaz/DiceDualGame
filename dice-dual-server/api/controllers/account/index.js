import { v4 as uuidv4 } from 'uuid'
import { responseData } from '../../../helpers/index.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, getUserOne, getUserOneWithOutPassword } from '../../service/user.js'
export default (socket, store) => {
    return {
        async getUserWithJwt(req, res) {
            try {
                const user = await getUserOneWithOutPassword({ _id: req.user.userId })
                res.json({
                    statusCode: 409,
                    data: {
                        name: user.name,
                        userId: user._id,
                    },
                })
            } catch (err) {
                res.json({
                    statusCode: 500,
                    massage: err.massage,
                })
            }
        },
        async checkToken() {
            const { token } = req.body
            jwt.verify(
                token,
                process.env.JWT_SECRET || 'test',
                (err, decoded) => {
                    if (err) {
                        return responseData(res, 401, null)
                    } else {
                        return responseData(res, 200, decoded)
                    }
                }
            )
        },
        async registerUser(req, res) {
            try {
                const { name, password, username } = await req.body
                const user = await getUserOne({
                    $or: [{ username }],
                })
                if (user) {
                    return responseData(res, 409, {
                        message: 'User already exists',
                    })
                }

                const salt = await bcrypt.genSalt(10)
                const userId = uuidv4()
                const hashedPassword = await bcrypt.hash(password, salt)
                const newUser = await createUser({
                    name,
                    username,
                    userId,
                    password: hashedPassword,
                })
                const payload = { userId: newUser.userId, name: newUser.name }

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET || 'test',
                    { expiresIn: '24h' },
                    (err, token) => {
                        if (err) throw err
                        return responseData(res, 201, {
                            message: 'User created',
                            token: token,
                        })
                    }
                )
            } catch (err) {
                console.error(err)
                return responseData(
                    res,
                    500,
                    {
                        message: err.message,
                    },
                    500
                )
            }
        },
        async login(req, res) {
            try {
                const { username, password } = await req.body
                const user = await getUserOne({ username })
                if (!user) {
                    return res.status(401).json({ message: 'Invalid username' })
                }
                const isPasswordMatch = await bcrypt.compare(
                    password,
                    user.password
                )
                if (!isPasswordMatch) {
                    return res.status(401).json({ message: 'Invalid password' })
                }
                const payload = { userId: user._id, name: user.name }

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET || 'test',
                    { expiresIn: '24h' },
                    (err, token) => {
                        if (err) throw err
                        res.json({ statusCode: 200, data: { token } })
                    }
                )
            } catch (err) {
                console.error(err.message)
                res.status(500).json({
                    statusCode: 500,
                    message: 'Server Error',
                })
            }
        },
    }
}
