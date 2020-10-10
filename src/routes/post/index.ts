import {Router} from 'express'
import {PostDao} from '../../dao/Post'

const router = Router()

router.get('/', async (req: any, res: any) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page)
  const s = req.query.s
  const response = await PostDao.getPostList({
    page,
    s
  })
  res.json(response)
})
module.exports = router;
