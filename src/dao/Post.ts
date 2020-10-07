import {getManager} from 'typeorm'
import {Post} from '../entity/Post'
import {jwtConfig} from '../config/blog.config'
import {DateFormatter} from "../lib/Utils";
const jwt = require('jsonwebtoken')
export const PostDao = {
  newPost: async (token, title, content, header_img?) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      post_id: null
    }
    const entityManager = getManager()
    let post = new Post()
    let user_id = null
    try {
      const raw = String(token).split(' ').pop()
      user_id = await jwt.verify(raw, jwtConfig.secret).id
    } catch (err) {
      console.log(err.message)
      return {
        status: 'error',
        msg: err.message
      }
    }
    post.user_id = user_id
    post.title = title
    post.content = content
    post.post_date = DateFormatter(new Date())
    post.update_date = DateFormatter(new Date())
    if (header_img !== undefined) post.content = header_img
    const postInfo = await entityManager.save(Post, post)
    response.status = 'ok'
    response.msg = '发表成功'
    response.post_id = postInfo.id
    return response
  }
}
