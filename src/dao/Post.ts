import {getManager} from 'typeorm'
import {Post} from '../entity/Post'
import {DateFormatter} from "../lib/Utils";

const Utils = require('../lib/Utils')

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
    const profile = await Utils.getProfileByToken(token)
    if (profile.status === 'error') return profile
    post.user_id = profile.id
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
    const profile = await Utils.getProfileByToken(token)
    if (profile.status === 'error') return profile
    const postInfo = await PostDao.getPost(id)
    if (String(postInfo.user_id) !== String(profile.id)) {
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
  },
  getList: async (id) => {
    const entityManager = getManager()
    const response = await entityManager.getRepository(Post).createQueryBuilder('post')
      .select('COUNT(*)','count')
      .where('user_id = :id', {id})
      .getRawOne()
    response.count = Number(response.count)
    return response
  }
}
