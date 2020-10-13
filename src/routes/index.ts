export {}
const express = require('express')
const router = express.Router()
//user
router.use('/user', require('./user/login'))
router.use('/user', require('./user/register'))
router.use('/user', require('./user/profile'))
router.use('/user', require('./user/media'))
router.use('/user', require('./user/verification'))
router.use('/captcha', require('./captcha'))

//cos
router.use('/cos', require('./cos/tst'))
router.use('/cos', require('./cos/put'))
router.use('/cos', require('./cos/upload'))

//post
router.use('/post', require('./post/edit'))
router.use('/post', require('./post/user'))
router.use('/post', require('./post/del'))
router.use('/post', require('./post/index'))
router.use('/post', require('./post/get'))
router.use('/post', require('./post/comment'))
module.exports = router
