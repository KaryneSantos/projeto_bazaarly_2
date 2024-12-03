require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(req.headers);
    console.log('token recebido: ', token);

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }

        req.email = decoded.email;
        next();
    });
};

module.exports = verifyJWT;
