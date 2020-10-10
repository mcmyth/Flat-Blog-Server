import {Router} from 'express'
import {PostDao} from '../../dao/Post'

const router = Router()

router.get('/', async (req: any, res: any) => {
  const page = req.query.page === undefined ? 1 : req.query.page
  const response = await PostDao.getPostList({
    page
  })
  res.json(response)
})
module.exports = router;
