import {getManager} from 'typeorm'
import {Verification} from '../entity/Verification'
import {UserDao} from "../dao/User";

const Utils = require('../lib/Utils')
const Mailer = require('../lib/Mailer')

export const VerificationDao = {
  newCode: async (user_id, type, email) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      verification: null
    }
    await VerificationDao.delCode(user_id, type)
    const entityManager = getManager()
    let verification = new Verification()
    let captchaKey = Utils.randomId()
    verification.user_id = user_id
    verification.type = type
    verification.code = captchaKey
    response.verification = await entityManager.save(Verification, verification)
    let profile = await UserDao.profileByID(user_id)
    if (profile !== undefined) {
      await Mailer.sendCaptchaKey(email, captchaKey, profile)
      response.status = 'ok'
      response.msg = '验证邮件已发送'
    } else {
      response.status = 'error'
      response.msg = '该用户不存在'
    }
    return response
  },
  getCode: async (user_id, type, code?) => {
    const entityManager = getManager()
    let get = await entityManager.getRepository(Verification).createQueryBuilder('verification')
      .where('user_id = :user_id', {user_id})
      .andWhere('type = :type',{type})
    let response
    if(code !== undefined) {
      response = await get.andWhere('code = :code', {code}).getOne()
    } else {
      response = await get.getOne()
    }
    if(response !== undefined) {
      return {
        verification: response,
        status: 'ok',
        msg: '获取成功'
      }
    } else {
      return {
        status: 'error',
        msg: '该验证码不存在或已过期'
      }
    }
  },
  delCode: async  (user_id, type, code?) => {
    const entityManager = getManager()
    let del = await entityManager.getRepository(Verification).createQueryBuilder('verification')
      .where('user_id = :user_id', {user_id})
      .andWhere('type = :type',{type})
    if(code === undefined) {
      await del.delete().execute()
    } else {
      await del.andWhere('code = :code', {code}).delete().execute()
    }
    return {
      status: 'ok',
      msg: '删除成功'
    }
  },
  verification: async (user_id, type, code) => {
    let t = new Date();
    t.setTime(t.getTime() + 1000 * 600)
    const entityManager = getManager()
    // remove expired verification code
    await entityManager.getRepository(Verification).createQueryBuilder('verification')
      .where('generation_date > :time', {time: t})
      .delete()
      .execute()
    let _code = await VerificationDao.getCode(user_id, type, code)
    if (_code.status !== 'error') {
      await VerificationDao.delCode(user_id, type, code)
      if(type === 'email') {
        await UserDao.updateEmailVerification(user_id, 1)
      }
      return true
    } else {
      return false
    }
  }
}
