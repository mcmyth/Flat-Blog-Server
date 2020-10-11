import {PostDao} from "../../dao/Post";

export {}
import {Router} from 'express'
import {CommentDao} from '../../dao/Comment'
import {env} from "../../config/env";

const router = Router()

router.post('/comment', async (req: any, res: any) => {
  const token = req.headers.authorization
  const postId = req.body.post_id
  const mode = req.body.mode
  if(mode === 'del') {
    const commentId = req.body.comment_id
    const response = await CommentDao.delComment(token, postId, commentId)
    res.json(response)
    return
  }
  const commentContent = req.body.comment_content
  const comment = await CommentDao.newComment(token, postId, commentContent)
  res.json(comment)
})

router.get('/comment', async (req: any, res: any) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page)
  const id = req.query.id
  if (id !== undefined) {
    const response = await CommentDao.getCommentList({
      id,
      page
    })
    res.json(response)
  } else {
    res.json({
      status: 'error',
      msg: "缺少必要的参数'id'"
    })
  }
})
module.exports = router;
