    const express = require('express');
    const router = express.Router();
    const User = require('../models/user');
    const sequelize = require('sequelize');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const path = require('path');


    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'cadastro.html'));
    });


    router.post('/', async(req, res) => {

        const { name, email, password, confirm_password, user_type } = req.body;

        console.log(name);
        console.log(email);
        console.log(password);
        console.log(confirm_password);
        console.log(user_type);

        const errors = [];

        if (!name || !email || !password || !confirm_password) {
            errors.push('Todos os campos são obrigatórios.');
            return res.status(400).json({ errors });
        }

        if(password.length < 8) {
            errors.push('A senha deve conter pelo menos 8 caracteres.');
            return res.status(400).json({ errors });
        }

        if(password != confirm_password){
            errors.push('As senhas não coincidem.');
            return res.status(400).json({ errors });
        }

        const usuario_existe = await User.findOne({where: {email: email}});
        if(usuario_existe) {
            errors.push('Email já está em uso.');
            return res.status(400).json({ errors });
        }

        
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ nome: name, email: email, senha: hashedPassword, tipo_usuario: user_type});
            const token = jwt.sign({ email: email },  process.env.secret, { expiresIn: '1h' });
            res.status(201).json({success: true, message: 'Usuário registrado com sucesso', token});
        } catch (err) {
            res.status(500).json(err);
        }
    });

    module.exports = router