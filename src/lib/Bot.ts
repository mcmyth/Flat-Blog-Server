import * as ws from 'ws'
import {UserDao} from "../dao/User"
import { simpleDescription } from "../lib/Utils"
import {env} from "../config/env"

export class BotServer {
  server: ws.Server
  client: Array<ws> = []
  constructor(port: number = 3004) {
    this.server = new ws.Server({ port })
    console.log(`Bot Server is running on ws://localhost:${port}/`)
    this.start()
  }

  private start () {
    this.server.on('connection', ws => {
      ws.on('message', message => {
        console.log('received: %s', message);
        this.client.push(ws)
      })
    })
    this.server.on('close', ws => {
      this.client.splice(this.client.indexOf(ws), 1)
    })
  }
  public send(message: string) {
    for (let i = 0; i < this.client.length; i++) {
      this.client[i].send(message, (err) => {
        if(err) this.client.splice(i, 1)
      })
    }
  }
  public async sendPost(id:number, user: string, title: string, description: string, type: 0 | 1 | 2) {
    const userProfile = await UserDao.profileByAccount(user)
    const text = `[MC Myth Blog]\n` +
      `${userProfile.username}${type === 0 ? `发表了新文章 《${title}》` :
        type === 1 ? `更新了文章《${title}》` : 
        type === 2 ? `发表针对《${title}》评论` : ''}\n` +
      `${simpleDescription(description)}\n`+
      `http://${env.blogDomain}/post/${id}`
    console.log(text)
    this.send(text)
  }
}
