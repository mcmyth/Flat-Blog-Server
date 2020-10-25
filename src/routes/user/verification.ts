export {}
import {Router} from 'express'
import {VerificationDao} from '../../dao/Verification'
import {UserDao} from '../../dao/User'

const router = Router()
const Utils = require('../../lib/Utils')

router.get('/verification', async (req: any, res: any) => {
  let type = req.query.type
  if(type === 'email') {
    const id = req.query.id
    const code = req.query.code
    const profile = await UserDao.profileByAccount(id)
    if (profile.email_verified !== 0) {
      const isPass = await VerificationDao.verification(id, type, code)
      if (isPass) {
        await UserDao.updateEmailVerification(id, 0)
        res.json({
          status: 'ok',
          msg: '邮箱已解绑'
        })
      } else {
        res.json({
          status: 'error',
          msg: '该验证码已过期或不存在'
        })
      }
      return
    }
    let isPass = await VerificationDao.verification(id, type, code)
    if (isPass) {
      res.json({
        status: 'ok',
        msg: '邮箱已验证'
      })
      return
    } else {
      res.json({
        status: 'error',
        msg: '该验证码已过期或不存在'
      })
      return
    }
  }
  if (type === 'password') {
    const id = req.query.id
    const code = req.query.code
    const password = req.query.password
    if (Utils.passwordIsValid(password) === false) {
      res.json({
        status: 'warning',
        msg: '密码格式不正确'
      })
      return
    }
    let isPass = await VerificationDao.verification(id, type, code)
    if (isPass) {
      const response = await UserDao.updatePassword(id, password)
      res.json(response)
      return
    } else {
      res.json({
        status: 'error',
        msg: '该验证码已过期或不存在'
      })
    }
  }
  res.json({
    status: 'error',
    msg: "缺少必要的参数'code'和'type'"
  })
})

router.post('/verification', async (req: any, res: any) => {
  const type = req.body.type
  let id = req.body.id
  let msg
  const profile = await UserDao.profileByAccount(id,true);
  if (type === 'email') {
    let email = req.body.email
    //Modify email
    if (profile.email_verified === 0) {
      if(email !== undefined) {
        const updateEmail = await UserDao.updateUserEmail(id, email)
        msg = '邮箱已更改并已发送验证邮件到新邮箱'
        if(updateEmail.status === 'error') return res.json(updateEmail)
        id = email
        profile.email = email
      } else {
        email = profile.email
      }
    } else if (profile.email_verified === 1) {
      if (email !== undefined)  {
        res.json({
          status: 'error',
          msg: "无法更改已验证的邮箱"
        })
        return
      } else {
        email = profile.email
        msg = '已发送验证邮件到原邮箱'
      }
    } else {
      res.json({
        status: 'error',
        msg: "数据异常"
      })
      return
    }
    //Send verification email
    let response = await VerificationDao.newCode(id, type, email)
    if (response.status === 'ok') response.msg = msg
    res.json({
      status: response.status,
      msg: response.msg
    })
    return
  }
  if (type === 'password') {
    const response = await VerificationDao.newCode(id, type, profile.email)
    response.email_verified = profile.email_verified
    res.json({
      status: response.status,
      msg: response.msg
    })
    return
  }
  res.json({
    status: 'error',
    msg: "缺少必要的参数"
  })
})
module.exports = router
