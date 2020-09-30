import {getManager} from "typeorm"
import {User} from '../entity/User'
const jwt = require('jsonwebtoken')
import {jwtConfig} from '../config/blog.config'
const bcrypt = require('bcrypt')
export const UserDao = {
    register: async (username,password,email,register_date) => {
        const entityManager = getManager()
        let user = new User()
        user.username = username
        user.password = await bcrypt.hash(password,10)
        user.email = email
        user.register_date = register_date
        return await entityManager.save(User, user)
    },
    login: async (username,password) => {
        const entityManager = getManager()
        let result = await entityManager.getRepository(User).createQueryBuilder('user')
            .where("username = :username", { username: username}).getOne()
        let isCorrectPassword = false
        let token = null
        if(result !== undefined){
            isCorrectPassword = await bcrypt.compare(password, result.password)
            token = 'Bearer ' + jwt.sign(
                {
                    id: result.id
                }, jwtConfig.secret, {expiresIn: jwtConfig.expiresIn}
            )
        }
        let response = {
            status: 'unknown',
            msg: '未知错误',
            token : null
        }
        if(isCorrectPassword){
            response.status = 'ok'
            response.msg = '登陆成功'
            response.token = token
        }else{
            response.status = 'error'
            response.msg = '密码或者用户名错误'
        }
        return response;
    }
}
