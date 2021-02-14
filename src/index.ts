const cookieParser = require('cookie-parser')
const express = require('express')
const session = require('express-session')
const expressJwt = require('express-jwt')
const index = require('./routes')
const Config = require('./config/blog.config')
import {BotServer} from './lib/Bot'
import {dbConnection} from './dao'

declare global {
  namespace NodeJS {
    interface Global {
      botServer: BotServer
    }
  }
}


const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(session(Config.SessionConfig))
app.use(expressJwt(Config.jwtConfig).unless({
  path: ["/register", "/login"]
}))
app.use((err, req, res, next) => {console.log(err.message);next()})
app.all('*', (req, res, next) => {
  Config.CrossOrigin(req, res, next)
})
app.use('/', index);
app.use('/api', index);
dbConnection(app).then(() => {global.botServer = new BotServer()})

