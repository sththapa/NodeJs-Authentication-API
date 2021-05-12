const express = require('express')
const app = express()
const routes = require('./routes/route')
const mongoose = require('mongoose')
app.use(express.json())
mongoose.connect('mongodb://localhost/authenticateDb', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
app.use('/api/user', routes)
app.listen(3000, function () {
    console.log('The server has started at port number 3000')
})