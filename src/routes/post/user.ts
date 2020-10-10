import {Router} from 'express'
import {PostDao} from '../../dao/Post'

const router = Router()
const Utils = require('../../lib/Utils')

router.get('/user', async (req: any, res: any) => {
  const token = req.headers.authorization
  const id = req.query.id
  const page = req.query.page === undefined ? 1 : Number(req.query.page)
  const s = req.query.s
  const profile = await Utils.getProfileByToken(token)
  if (id !== undefined) {
    let isMe = false
    if (profile.id == id) isMe = true
    const response = await PostDao.getPostList({
      isMe,
      id,
      page,
      s
    })
    res.json(response)
  } else {
    if (profile.status === 'error') {
      res.json(profile)
      return
    }
    const response = await PostDao.getPostList({
      isMe: true,
      id: profile.id,
      page,
      s
    })
    res.json(response)
  }
})
module.exports = router;
