import {createConnection} from "typeorm"
import {env} from "../config/env";
import { User } from '../entity/User'
import { Media } from '../entity/Media'
import { Post } from '../entity/Post'
import { Comment } from '../entity/Comment'
import { Verification } from '../entity/Verification'
export const dbConnection = async (app) => {
  createConnection({
      "host": env.database.host,
      "port": env.database.port,
      "username": env.database.username,
      "password": env.database.password,
      "database": env.database.database,
      "type": "mysql",
      "charset": "utf8mb4",
      "synchronize": true,
      "logging": false,
      "entities": [
        User,
        Post,
        Media,
        Comment,
        Verification
      ],
      "migrations": [
        "src/migration/**/*.ts"
      ],
      "subscribers": [
        "src/subscriber/**/*.ts"
      ],
      "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
      }
    }
  ).then(async connection => {
    console.log('server is running...')
    app.listen(3003)
  })
}

