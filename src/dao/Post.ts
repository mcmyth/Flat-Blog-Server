import {getManager} from 'typeorm'
import {Post} from '../entity/Post'
import {DateFormatter} from "../lib/Utils";
import {UserDao} from "./User";
import {CommentDao} from "./Comment";
import {env} from "../config/env";
const COS = require('../lib/Cos')

const Utils = require('../lib/Utils')
const marked = require('marked');
const trimHtml = require('trim-html')

export const PostDao = {
  newPost: async (token, title, content_md, header_img?) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      post_id: null,
      post_uuid: null
    }
    content_md = content_md.replace(/\n+$/, '')
    const entityManager = getManager()
    let post = new Post()
    const profile = await Utils.getProfileByToken(token)
    if (profile.status === 'error') return profile
    post.user_id = profile.id
    post.title = title
    post.content_md = content_md
    post.content_html = marked(content_md)
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
  updatePost: async (id, token, title, content_md, header_img?) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      post_id: null,
      post_uuid: null
    }
    content_md = content_md.replace(/\n+$/, '')
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
        content_md
      }
    } else {
      header_img = postInfo.header_img
      data = {
        title: title,
        content_md,
        content_html: marked(content_md),
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
  getPost: async id => {
    const entityManager = getManager()
    let response: any = await entityManager.getRepository(Post).createQueryBuilder('post')
      .where('id = :id OR uuid = :id', {id})
      .select(['post.id', 'post.title', 'post.content_md', 'post.content_html', 'post.uuid', 'post.header_img', 'post.user_id', 'post.update_date', 'post.post_date'])
      .getOne()
    if (response !== undefined) {
      response.user = await UserDao.profileByAccount(response.user_id)
      response.user_id
      response.update_date = Utils.DateFormatter(response.update_date)
      response['status'] = 'ok'
      response['msg'] = '获取成功'
    } else {
      response = {
        status: 'error',
        msg: '找不到该文章'
      }
    }
    return response
  },
  delPost: async id => {
    const entityManager = getManager()
    const post = await PostDao.getPost(id)
    await COS.del(`post/banner/${post.uuid}`)
    await entityManager.getRepository(Post).createQueryBuilder('post')
      .where('id = :id OR uuid = :id', {id})
      .delete()
      .execute()
    await CommentDao.delPostComment(id)
    return {
      status: 'ok',
      msg: '删除文章成功'
    }
  },
  getPostList: async (options) => {
    let profile = await UserDao.profileByAccount(options.id)
    let id = profile.id
    let response = {
      status: 'unknown',
      msg: '未知错误'
    }
    const entityManager = getManager()
    if (!options.isMe && options.isMe !== undefined) {
      const profile = await UserDao.profileByAccount(options.id)
      id = profile.id
    }
    //get post
    const pageSize = 5
    const pageIndex = Utils.getRowIndex(options.page, pageSize)
    let post
    let _count
    post = await entityManager.getRepository(Post).createQueryBuilder('post')
      .select(['post.id', 'post.uuid', 'post.header_img', 'post.title', 'post.content_html', 'post.update_date', 'post.user_id'])
      .skip(pageIndex)
      .take(pageSize)
      .orderBy('post.id',"DESC")
    let searchCondition = '(post.title LIKE :param or post.content_md LIKE :param)'
    if(options.id !== undefined) {
      //get post count
      if (options.s !== undefined) {
        _count = await entityManager.getRepository(Post).createQueryBuilder('post')
          .select('COUNT(*)','count')
          .where('user_id = :id', {id})
          .andWhere(searchCondition,{param: `%${options.s}%`})
          .getRawOne()
        post = await post
          .where('user_id = :id', {id})
          .andWhere(searchCondition,{param: `%${options.s}%`})
          .getMany()
      } else {
        _count = await entityManager.getRepository(Post).createQueryBuilder('post')
          .select('COUNT(*)','count')
          .where('user_id = :id', {id})
          .getRawOne()
        post = await post.where('user_id = :id', {id}).getMany()
      }
    } else {
      //get post count
      if (options.s !== undefined) {
        _count = await entityManager.getRepository(Post).createQueryBuilder('post')
          .select('COUNT(*)','count')
          .where(searchCondition,{param: `%${options.s}%`})
          .getRawOne()
        post = await post
          .where(searchCondition, {param: `%${options.s}%`})
          .getMany()
      } else {
        _count = await entityManager.getRepository(Post).createQueryBuilder('post')
          .select('COUNT(*)','count')
          .getRawOne()
        post = await post.getMany()
      }
    }
    for (let i = 0; i < post.length; i++) {
      let v = post[i]
      let tHtml = trimHtml(v.content_html, {
        limit: 200,
        preserveTags: true
      })
      v.content_html = Utils.parseToText(tHtml.html)
      const profile = await UserDao.profileByAccount(v.user_id)
      delete v.user_id
      v['nickname'] = profile.nickname
      v['username'] = profile.username
      v['avatar_img'] = 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/avatar_img/' + profile.uuid
      if (v.header_img === '') {
        v['banner_img'] = 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/banner_img/' + profile.uuid
      } else {
        v['banner_img'] = 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'post/banner/' + v.uuid
      }
      v.update_date = Utils.DateFormatter(v.update_date,false)
    }
    response['post'] = post
    response['status'] = 'ok'
    response['msg'] = '获取成功'
    response['page_count'] = Math.ceil(Number(_count.count) / pageSize)
    return response
  }
}
