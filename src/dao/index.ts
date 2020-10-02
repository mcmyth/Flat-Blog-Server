import {createConnection} from "typeorm";
export const dbConnection = async (app) => {
    createConnection().then(async connection => {
        app.listen(3003)
    })
}

