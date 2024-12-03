const express = require('express');
const sequelize = require('./config/database');
const {User} = require('./models/user');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
const verifyJWT = require('./middleware/auth');

app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.options('*', cors());

sequelize.sync({ force: false }).then(() => {
    console.log('Banco de dados sincronizado.');
}).catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const indexRouter = require('./router/index');
app.use('/', indexRouter);

const userRouter = require('./router/user');
app.use('/user', userRouter);

const authRouter = require('./router/auth');
app.use('/auth', authRouter);

const profileRouter = require('./router/profile');
app.use('/profile', profileRouter);

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});