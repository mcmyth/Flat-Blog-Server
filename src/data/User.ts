import {getManager} from "typeorm"
import {User} from '../entity/User'

export const UserDao = {
    register: async (username,password,email,register_date) => {
        const entityManager = getManager()
        let user = new User()
        user.username = username
        user.password = password
        user.email = email
        user.register_date = register_date
        return await entityManager.save(User, user) // user表中插入数据
    }
}
