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
      post_id: null,
      post_uuid: null
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
    if (header_img !== undefined) post.header_img = header_img
    const postInfo = await entityManager.save(Post, post)
    response.status = 'ok'
    response.msg = '发表成功'
    response.post_id = postInfo.id
    response.post_uuid = postInfo.uuid
    return response
  },
  updatePost: async (id, token, title, content, header_img?) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      post_id: null,
      post_uuid: null
    }
    let user_id = null
    try {
      const raw = String(token).split(' ').pop()
      user_id = await jwt.verify(raw, jwtConfig.secret).id
    } catch (err) {
      return {
        status: 'error',
        msg: err.message
      }
    }
    const postInfo = await PostDao.getPost(id)
    if (String(postInfo.user_id) !== String(user_id)) {
      response.status = 'error'
      response.msg = '权限不足'
      return response
    }
    let data
    if (header_img !== undefined) {
      data = {
        title: title,
        content: content
      }
    } else {
      data = {
        title: title,
        content: content,
        update_date: DateFormatter(new Date()),
        header_img
      }
    }
    const entityManager = getManager()
    await entityManager.createQueryBuilder()
      .update(Post)
      .set(data)
      .where("id = :id", {id})
      .execute()
    response.status = 'ok'
    response.msg = '更新成功'
    response.post_id = postInfo.id
    response.post_uuid = postInfo.uuid
    return response
  },
  insertBanner: async (id, header_img) => {
    const entityManager = getManager()
    await entityManager.createQueryBuilder()
      .update(Post)
      .set({header_img: header_img.href})
      .where("uuid = :id", {id})
      .execute()
  },
  getPost: async (id) => {
    const entityManager = getManager()
    let response: any = await entityManager.getRepository(Post).createQueryBuilder('post')
      .where('id = :id OR uuid = :id', {id})
      .select(['post.title', 'post.content', 'post.uuid', 'post.header_img', 'post.user_id'])
      .getOne()
    if (response !== undefined) {
      response['status'] = 'ok'
      response['message'] = '获取成功'
    } else {
      response = {
        status: 'error',
        msg: '找不到该文章'
      }
    }
    return response
  }
}
