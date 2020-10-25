export {}
import {Router} from 'express'
import {UserDao} from '../../dao/User'

const router = Router()

router.get('/profile', (req: any, res: any) => {
  if (req.query.id !== undefined) {
    UserDao.profileByAccount(req.query.id).then(response => {
      res.json(response)
    })
  } else {
    let token = req.headers.authorization
    UserDao.profileByToken(token).then(response => {
      res.json(response)
    })
  }
});
router.post('/profile', async (req: any, res: any) => {
  let response: any = {
    status: 'unknown',
    msg: '未知错误'
  }
  let token = req.headers.authorization
  const nickname = req.body.nickname
  if (nickname !== undefined) {
    response = await UserDao.updateUserName(token, nickname)
    res.json(response)
    return
  }
  res.json(response)
});
module.exports = router;
