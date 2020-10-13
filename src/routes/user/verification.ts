export {}
import {Router} from 'express'
import {VerificationDao} from '../../dao/Verification'
import {UserDao} from '../../dao/User'
const router = Router()

router.get('/verification', async (req: any, res: any) => {
  let type = req.query.type
  if(type === 'email') {
    let id = req.query.id
    let code = req.query.code
    let profile = await UserDao.profileByID(id)
    if (profile.email_verified !== 0) {
      let isPass = await VerificationDao.verification(id, type, code)
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
  res.json({
    status: 'error',
    msg: "缺少必要的参数'code'和'type'"
  })
})

router.post('/verification', async (req: any, res: any) => {
  let type = req.body.type
  let id = req.body.id
  let profile = await UserDao.profileByID(id,true)
  if(type === 'email') {
    let email = req.body.email
    //Modify email
    if(profile.email_verified !== 0 && email !== undefined) {
      res.json({
        status: 'error',
        msg: '邮箱修改失败'
      })
      return
    } else {
      email = profile.email
    }
    //Send verification email
    let response = await VerificationDao.newCode(id, type, email)
    res.json(response)
    return
  }
})
module.exports = router
