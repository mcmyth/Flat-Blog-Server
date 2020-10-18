import {getManager} from 'typeorm'
import {User} from '../entity/User'
import {env} from "../config/env"

const Utils = require('../lib/Utils')
const bcrypt = require('bcrypt')
export const UserDao = {
  register: async (username, password, email, register_date) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      token: null
    }
    if (Utils.usernameIsValid(username) === false) {
      response.status = 'error'
      response.msg = '用户名长度3-10且必须包含大写或小写字母,可包含数字或下划线'
      return response
    }
    if (Utils.passwordIsValid(password) === false) {
      response.status = 'error'
      response.msg = '密码长度6-16且必须包含括号内任意两种组合(0-9,A-Z,a-z,@#$%^&*?+_)'
      return response
    }
    if (Utils.emailIsValid(email) === false) {
      response.status = 'error'
      response.msg = '邮箱格式不正确'
      return response
    }
    const entityManager = getManager()
    let checkUser
    checkUser = await entityManager.getRepository(User).createQueryBuilder('user')
      .where("username = :username", {username})
      .getOne()
    if (checkUser !== undefined) {
      response.status = 'error'
      response.msg = '用户名已存在'
      return response
    }
    checkUser = await entityManager.getRepository(User).createQueryBuilder('user')
      .where("email = :email", {email})
      .getOne()
    if (checkUser !== undefined) {
      response.status = 'error'
      response.msg = '邮箱已存在'
      return response
    }
    let user = new User()
    user.username = username
    user.nickname = username
    user.password = await bcrypt.hash(password, 10)
    user.email = email
    user.register_date = register_date
    const userProfile = await entityManager.save(User, user)
    const token = Utils.signJwt({
      id: userProfile.id
    })
    response.token = token
    response.status = 'ok'
    response.msg = '注册成功!'
    return response
  },
  login: async (username, password) => {
    const entityManager = getManager()
    let result = await entityManager.getRepository(User).createQueryBuilder('user')
      .where("username = :username or email = :email", {username, email: username})
      .select(['user.id', 'user.username'])
      .addSelect(['user.password'])
      .getOne()
    let isCorrectPassword = false
    let token = null
    if (result !== undefined) {
      isCorrectPassword = await bcrypt.compare(password, result.password)
      token = Utils.signJwt({
        id: result.id
      })
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
  profileByToken: async token => {
    const profile = await Utils.getProfileByToken(token)
    if (profile.status === 'error') return profile
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
  profileByAccount: async (id, deep = false) => {
    let profile:any = {
      status: 'unknown',
      msg: '未知错误'
    }
    const entityManager = getManager()
    let response:any = await entityManager.getRepository(User).createQueryBuilder('user')
      .where('id = :id OR uuid = :id OR username = :id OR email = :id', {id})
    if(deep) {
      response = await response.select(['user.id', 'user.username', 'user.nickname', 'user.uuid', 'user.email_verified', 'user.email']).getOne()
    } else {
      response = await response.select(['user.id', 'user.username', 'user.nickname', 'user.uuid', 'user.email_verified']).getOne()
    }
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
  },
  updateUserName: async (token, nickname) => {
    let response:any = {
      status: 'unknown',
      msg: '未知错误'
    }
    const profile = await Utils.getProfileByToken(token)
    if (profile.status === 'error') return profile
    if (Utils.usernameIsValid(nickname) === false) {
      response.status = 'error'
      response.msg = '用户名长度3-10且必须包含大写或小写字母,可包含数字或下划线'
      return response
    }
    const entityManager = getManager()
    await entityManager.createQueryBuilder()
      .update(User)
      .set({nickname})
      .where("id = :id", {id: profile.id})
      .execute()
    response.status = 'ok'
    response.msg = '昵称更新成功'
    return response
  },
  updateUserEmail: async (id, email) => {
    let response:any = {
      status: 'unknown',
      msg: '未知错误'
    }
    if (Utils.emailIsValid(email) === false) {
      response.status = 'error'
      response.msg = '邮箱格式不正确'
      return response
    }
    const entityManager = getManager()
    let profile = await UserDao.profileByAccount(id,true)
    // Exclude itself to find whether other users have the same mailbox
    let profileByEmail:any = await entityManager.getRepository(User).createQueryBuilder('user')
      .where('email = :email',{email})
      .andWhere('id != :id AND uuid != :id AND username != :id AND email != :id', {id})
      .getOne()
    if (profile.status === 'error') return profile
    if(await UserDao.profileByAccount(email) !== undefined && profileByEmail !== undefined) {
      return {
        status: 'error',
        msg: '该邮箱已被注册'
      }
    }
    await entityManager.createQueryBuilder()
      .update(User)
      .set({email})
      .where("id = :id", {id: profile.id})
      .execute()
    response.status = 'ok'
    response.msg = '邮箱更新成功'
    return response
  },
  updateEmailVerification: async (id, state) => {
    let response:any = {
      status: 'unknown',
      msg: '未知错误'
    }
    const entityManager = getManager()
    await entityManager.createQueryBuilder()
      .update(User)
      .set({email_verified: state})
      .where("id = :id", {id})
      .execute()
    response.status = 'ok'
    response.msg = '状态更新成功'
    return response
  },
  updatePassword: async (id, password) => {
    let response:any = {
      status: 'unknown',
      msg: '未知错误'
    }
    password = await bcrypt.hash(password, 10)
    const entityManager = getManager()
    await entityManager.createQueryBuilder()
      .update(User)
      .set({password})
      .where("id = :id", {id})
      .execute()
    response.status = 'ok'
    response.msg = '密码已更改'
    return response
  }
}
