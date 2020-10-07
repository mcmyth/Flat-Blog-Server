export {}
const express = require('express')
const router = express.Router()
const userLogin = require('./user/login')
const userRegister = require('./user/register')
const userProfile = require('./user/profile')
const captcha = require('./captcha')
const cosUpload = require('./cos/upload')
const cosTst = require('./cos/tst')
const cosPut = require('./cos/put')
const postEdit = require('./post/edit')
//Routers
//user
router.use('/user', userLogin)
router.use('/user', userRegister)
router.use('/user', userProfile)
router.use('/captcha', captcha)

//cos
router.use('/cos', cosTst)
router.use('/cos', cosPut)
router.use('/cos', cosUpload)

//post
router.use('/post', postEdit)
module.exports = router
