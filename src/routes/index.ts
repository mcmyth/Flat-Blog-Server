export {}
const express=require('express');
const router = express.Router();   //可使用 express.Router 类创建模块化、可挂载的路由句柄
const login = require('./user/login')
const register = require('./user/register')
const captcha = require('./captcha')
const profile = require('./user/profile')
//Routers
router.use('/user',login)
router.use('/user',register)
router.use('/user',profile)
router.use('/captcha',captcha)
module.exports = router
