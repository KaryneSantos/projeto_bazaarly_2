const express = require('express');
const router = express.Router();
const User = require('../models/user')
const path = require('path');
const verifyJWT = require('../middleware/auth');


router.get('/', verifyJWT, async(req, res) => {
    console.log('Email autenticado:', req.email);
    if (!req.email) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }
          
    const user = await User.findOne({ where: { email: req.email } });
    console.log('User: ',user);
        
    if (!user) {
         return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
        
    res.json({ success: true, user: { email: req.email } });

    // res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'home.html'));
});

module.exports = router;