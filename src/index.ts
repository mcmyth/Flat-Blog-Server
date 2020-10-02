const cookieParser = require("cookie-parser")
const express = require('express')
const session = require("express-session")
const expressJwt = require('express-jwt')
const index = require('./routes')
const Config = require('./config/blog.config')
import { dbConnection } from './dao'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(session(Config.SessionConfig))
app.use(expressJwt(Config.jwtConfig).unless({
    path: ["/register","/login"]
}))
app.all('*', (req, res, next) => {Config.CrossOrigin(req, res, next)})
app.use('/',index);
dbConnection(app)

