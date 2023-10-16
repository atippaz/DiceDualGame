import { v4 as uuidv4 } from 'uuid'
import { responseData } from '../../../helpers/index.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, getUserOne } from '../../service/user.js'
export default (socket, store) => {
    return {
        async getUserWithJwt(req, res) {
            try {
                const user = await getUserOne({ _id: req.user.userId })
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
        async registerUser(req, res) {
            try {
                const { name, password, username } = await req.body
                const user = await getUserOne({
                    $or: [{ username }],
                })
                if (user) {
                    return res.status(409).json({
                        statusCode: 409,
                        message: 'User already exists',
                    })
                }

                const salt = await bcrypt.genSalt(10)
                const userId = uuidv4()
                const hashedPassword = await bcrypt.hash(password, salt)
                const newUser = createUser({
                    name,
                    username,
                    userId,
                    password: hashedPassword,
                })
                const token = jwt.sign(
                    { userId: newUser._id, email: newUser.name },
                    process.env.JWT_SECRET || 'test',
                    { expiresIn: '24h' }
                )
                res.status(201).json({
                    statusCode: 201,
                    data: { message: 'User created', token },
                })
            } catch (err) {
                console.error(err)
                res.status(500).json({ statusCode: 500, message: err.message })
            }
        },
        async login(req, res) {
            try {
                const { username, password } = await req.body
                const user = await getUserOne({ username })
                console.log(user)
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
