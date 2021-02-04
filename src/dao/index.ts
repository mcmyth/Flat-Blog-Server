import {createConnection} from "typeorm"
import {env} from "../config/env";
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
        "src/entity/**/*.ts"
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

