const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRouter = require('./routers/authRouter');

require('./lib/connectMongoose');

const app = express();

app.use(cors());
app.use(helmet())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);

app.get('/', (req, res) => { 
    res.json({ message: 'Hello World' });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});