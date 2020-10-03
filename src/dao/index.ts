import {createConnection} from "typeorm"

export const dbConnection = async (app) => {
  createConnection().then(async connection => {
    console.log('server is running...')
    app.listen(3003)
  })
}

