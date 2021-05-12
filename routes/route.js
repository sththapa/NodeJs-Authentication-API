require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const private = require('../middleware')
const { signInValidation, logInValidation } = require('../authentication')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.get('/posts', private, function (req, res) {
    res.send('Posts')
})

router.post('/signin', async function (req, res) {
    //Validation
    const { error } = signInValidation(req.body)
    if (error) {
        return res.send(error.details[0].message)
    }
    //checking if the user already exists in the database
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
        res.status(400).send('This email already exists')
    }
    //hashing the password before saving it to the database
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        return res.status(201).json(savedUser)
    }
    catch (err) {
        return res.status(400).send(err)
    }
})
router.post('/login', async function (req, res) {
    //Validation
    const { error } = logInValidation(req.body)
    if (error) {
        return res.send(error.details[0].message)
    }
    //checking if the user email exits in the database
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send('Email not found')
    }
    //checking if the logged in credentials matches the password
    const matchedPassword = await bcrypt.compare(req.body.password, user.password)
    if (!matchedPassword) {
        return res.status(400).send('Invalid Password')
    }

    //Creating a JSON Web Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN)
    res.header('jwt-token', token).send(token)
})
module.exports = router
