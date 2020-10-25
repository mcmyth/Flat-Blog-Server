export {}
import {Router} from 'express'

const Utils = require('../../lib/Utils')
const router = Router()

router.get('/token', async (req: any, res: any) => {
  const token = req.headers.authorization
  const profile = await Utils.getProfileByToken(token)
  if (profile.status === 'ok') {
    res.json({
      status: 'ok',
      msg: 'token已签发',
      token:Utils.signJwt({id: profile.id})
    })
  } else {
    res.json(profile)
  }
})
module.exports = router
