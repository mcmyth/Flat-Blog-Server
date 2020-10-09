import {Router} from 'express'
import {PostDao} from '../../dao/Post'

const router = Router()
const Utils = require('../../lib/Utils')

router.get('/list', async (req: any, res: any) => {
  const token = req.headers.authorization
  const id = req.query.id
  const page = req.query.page === undefined ? 1 : req.query.page
  const profile = await Utils.getProfileByToken(token)
  if (id !== undefined) {
    let isMe = false
    if (profile.id == id) isMe = true
    const response = await PostDao.getList({
      isMe,
      id,
      page
    })
    res.json(response)
  } else {
    if (profile.status === 'error') {
      res.json(profile)
      return
    }
    const response = await PostDao.getList({
      isMe: true,
      id: profile.id,
      page
    })
    res.json(response)
  }
})
module.exports = router;
