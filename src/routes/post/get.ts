import {Router} from 'express'
import {PostDao} from '../../dao/Post'

const router = Router()

router.get('/get', async (req: any, res: any) => {
  const id = req.query.id
  if (id !== undefined) {
    const post = await PostDao.getPost(id)
    res.json(post)
  } else {
    res.json({
      status: 'error',
      msg: "缺少必要的参数'id'"
    })
  }
})
module.exports = router;
