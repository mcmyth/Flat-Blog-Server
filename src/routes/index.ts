export {}
const express = require('express')
const router = express.Router()
const login = require('./user/login')
const register = require('./user/register')
const captcha = require('./captcha')
const profile = require('./user/profile')
const upload = require('./cos/upload')
const tst = require('./cos/tst')
const put = require('./cos/put')

//Routers
//user
router.use('/user', login)
router.use('/user', register)
router.use('/user', profile)
router.use('/captcha', captcha)

//cos
router.use('/cos', tst)
router.use('/cos', put)
router.use('/cos', upload)

module.exports = router
