const jwt = require('jsonwebtoken')
const auth = function (req, res, next) {
    const token = req.header('jwt-token')
    if (!token) {
        return res.status(401).send('Access Denied')
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = verified
        next()
    }
    catch (err) {
        return res.status(400).send('Invalid token')
    }
}
module.exports = auth