export {}
import {Router} from 'express'

const router = Router()
import {UserDao} from '../../dao/User'

router.get('/profile', (req: any, res: any) => {
  if (req.query.id !== undefined) {
    UserDao.profileByID(req.query.id).then(response => {
      res.json(response)
    })
  } else {
    let token = req.headers.authorization
    UserDao.profileByToken(token).then(response => {
      res.json(response)
    })
  }

});
module.exports = router;
