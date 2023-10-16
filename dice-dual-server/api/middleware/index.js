import jwt from 'jsonwebtoken'
const checkToken = (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.status(401).json({ status: 401, error: 'please login' })
    }
    const token = req.header('Authorization').replace('Bearer ', '')

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'test', (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ status: 401, error: 'Invalid token' })
            } else {
                req.user = decoded
                next()
            }
        })
    } else {
        return res.status(401).json({ status: 401, error: 'Invalid token' })
    }
}
function convertJwt(req, res, next) {
    if (!req.header('Authorization')) {
        return res.status(401).json({ status: 401, error: 'please login' })
    }

    const token = req.header('Authorization').replace('Bearer ', '')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test')
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).send({ status: 401, error: 'Invalid token' })
    }
}
export { checkToken, convertJwt }
