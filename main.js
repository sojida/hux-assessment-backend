const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routes/auth.route')
const contactRouter = require('./routes/contact.route');
const cors = require('cors');

const app = express()

app.use(morgan('dev')); // logger
app.use(express.json()) // body parser
app.use(express.urlencoded({ extended: true })); // body parser: form-data

app.use(cors({
    origin: '*'
}))


app.get('/', (req, res) => {
    return res.send('Contacts API')
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/contacts', contactRouter);

app.use('*', (req, res) => {
    return res.status(404).json({
        code: 404,
        message: 'Route not found',
        success: false
    })
})


module.exports = app;
