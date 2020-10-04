import {getManager} from "typeorm"
import {User} from '../entity/User'
import {jwtConfig} from '../config/blog.config'
import {env} from "../config/env"

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
export const UserDao = {
  register: async (username, password, email, register_date) => {
    const entityManager = getManager()
    let user = new User()
    user.username = username
    user.nickname = username
    user.password = await bcrypt.hash(password, 10)
    user.email = email
    user.register_date = register_date
    return await entityManager.save(User, user)
  },
  login: async (username, password) => {
    const entityManager = getManager()
    let result = await entityManager.getRepository(User).createQueryBuilder('user')
      .where("username = :username", {username: username})
      .select(['user.id', 'user.username'])
      .addSelect(['user.password'])
      .getOne()
    let isCorrectPassword = false
    let token = null
    if (result !== undefined) {
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
      token: null
    }
    if (isCorrectPassword) {
      response.status = 'ok'
      response.msg = '登陆成功'
      response.token = token
    } else {
      response.status = 'error'
      response.msg = '密码或者用户名错误'
    }
    return response;
  },
  profileByToken: async (token) => {
    let profile
    try {
      const raw = String(token).split(' ').pop()
      profile = await jwt.verify(raw, jwtConfig.secret)
    } catch (err) {
      console.log(err.message)
      return {
        status: 'error',
        msg: err.message
      }
    }
    const entityManager = getManager()
    let response = await entityManager.getRepository(User).createQueryBuilder('user')
      .where('id = :id', {id: profile.id})
      .getOne()
    response['banner_img'] = 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/banner_img/' + response.uuid
    response['avatar_img'] = 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/avatar_img/' + response.uuid
    response['status'] = 'ok'
    response['message'] = '获取成功'
    return response
  },
  profileByID: async (id) => {
    let profile:any = {
      status: 'unknown',
      msg: '未知错误'
    }
    const entityManager = getManager()
    let response = await entityManager.getRepository(User).createQueryBuilder('user')
      .where('id = :id OR uuid = :id', {id})
      .select(['user.id', 'user.username', 'user.nickname', 'user.uuid'])
      .getOne()
    if (response !== undefined) {
      profile = response
      profile['banner_img'] = 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/banner_img/' + response.uuid
      profile['avatar_img'] = 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/avatar_img/' + response.uuid
      profile['status'] = 'ok'
      profile['message'] = '获取成功'
    } else {
      profile['status'] = 'error'
      profile['msg'] = '获取失败,该用户可能不存在'
    }

    return profile
  }
}
