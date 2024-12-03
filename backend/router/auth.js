const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'login.html'));
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const errors = [];

    if(!email || !password) {
        errors.push('Todos os campos são obrigatórios.');
        return res.status(400).json({ errors });
    }

    if(password.length < 8) {
        errors.push('A senha deve conter pelo menos 8 caracteres.');
        return res.status(400).json({ errors });
    }

    const user = await User.findOne({where: {email: email}});
    
    if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.senha);
        console.log("Senha válida:",isPasswordValid);

        if (isPasswordValid) {
            const token = jwt.sign({ email: user.email }, process.env.secret, { expiresIn: '1h' });
            console.log('Token gerado: ', token);
            res.status(200).json({ auth: true, user: user, token: token });
        } else {
            res.status(401).json('Login not successful.');
        }
    } else {
        res.status(401).json('Login not successful.');
    }
});

module.exports = router;