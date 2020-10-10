export {}
const express = require('express')
const router = express.Router()
const userLogin = require('./user/login')
const userRegister = require('./user/register')
const userProfile = require('./user/profile')
const userMedia = require('./user/media')
const captcha = require('./captcha')
const cosUpload = require('./cos/upload')
const cosTst = require('./cos/tst')
const cosPut = require('./cos/put')
const postEdit = require('./post/edit')
const postUserList = require('./post/user')
const postList = require('./post/index')
const postDel = require('./post/del')
//Routers
//user
router.use('/user', userLogin)
router.use('/user', userRegister)
router.use('/user', userProfile)
router.use('/user', userMedia)
router.use('/captcha', captcha)

//cos
router.use('/cos', cosTst)
router.use('/cos', cosPut)
router.use('/cos', cosUpload)

//post
router.use('/post', postEdit)
router.use('/post', postUserList)
router.use('/post', postDel)
router.use('/post', postList)
module.exports = router
