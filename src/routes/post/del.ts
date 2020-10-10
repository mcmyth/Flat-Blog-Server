import {Router} from 'express'
import {PostDao} from '../../dao/Post'

const router = Router()
const Utils = require('../../lib/Utils')

router.get('/del', async (req: any, res: any) => {
  const token = req.headers.authorization
  const PostId = req.query.id
  if (PostId !== undefined) {
    const profile = await Utils.getProfileByToken(token)
    const post = await PostDao.getPost(PostId)
    if (post.status !== 'error') {
      if (Number(post.user_id) !== profile.id) {
        res.json({
          status: 'error',
          msg: "权限不足"
        })
      } else {
        const isDelPost = await PostDao.delPost(PostId)
        res.json(isDelPost)
        return
      }
    } else {
      res.json (post)
      return
    }
  } else {
    res.json({
      status: 'error',
      msg: "缺少必要的参数'id'"
    })
  }
})
module.exports = router;
