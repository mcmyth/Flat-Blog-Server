export {}
import {Router} from 'express'
import {DateFormatter} from '../../lib/Utils'
import {UserDao} from '../../dao/User'

const router = Router();
router.post('/register', async (req: any, res: any) => {
  const srvCaptchaKey = req.session.captchaKey
  const cliCaptchaKey = req.body.captchaKey
  if (srvCaptchaKey !== undefined && srvCaptchaKey === cliCaptchaKey) {
    const data = req.body
    const now = DateFormatter(new Date())
    const response = await UserDao.register(data.username, data.password, data.email, now)
    res.json(response)
  } else {
    res.json({
      status: 'error',
      msg: '验证码错误'
    })
  }
  req.session.captchaKey = undefined
});

module.exports = router;
