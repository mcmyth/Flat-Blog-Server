import {getManager} from 'typeorm'
import {Comment} from '../entity/Comment'
import {UserDao} from "./User"
import {env} from "../config/env"
import {Post} from "../entity/Post";

const Utils = require('../lib/Utils')

export const CommentDao = {
  newComment: async (token,post_id,content) => {
    const entityManager = getManager()
    let response = {
      status: 'unknown',
      msg: '未知错误',
      comment_id: null
    }
    if (content === '') {
      response.status = 'error'
      response.msg = '评论内容不能为空'
      return response
    }
    let comment = new Comment()
    const profile = await Utils.getProfileByToken(token)
    if (profile.status === 'error') return profile
    comment.user_id = profile.id
    comment.post_id = post_id
    comment.content = content
    const commentInfo = await entityManager.save(Comment, comment)
    response.comment_id = commentInfo.id
    response.status = 'ok'
    response.msg = '发表成功'
    return response
  },
  delComment: async (token, postId, commentId) => {
    const entityManager = getManager()
    const profile = await Utils.getProfileByToken(token)
    const commentInfo:any = await CommentDao.getComment(postId, commentId)
    if (commentInfo.comment === undefined) {
      return {
        status: 'error',
        msg: '该评论不存在'
      }
    } else {
      if (commentInfo.comment.user_id !== profile.id){
        return {
          status: 'error',
          msg: '权限不足'
        }
      }
      await entityManager.getRepository(Comment).createQueryBuilder('comment')
        .where('post_id = :post_id', {post_id: postId})
        .andWhere('id = :id OR uuid = :id',{id: commentId})
        .delete()
        .execute()
      return {
        status: 'ok',
        msg: '删除评论成功'
      }
    }
  },
  getComment: async (postId, commentId) => {
    let response = {
      status: 'unknown',
      msg: '未知错误'
    }
    const entityManager = getManager()
    const comment = await entityManager.getRepository(Comment).createQueryBuilder('comment')
      .select(['comment.id', 'comment.content', 'comment.comment_date', 'comment.user_id'])
      .where('id = :id OR uuid = :id',{id: commentId})
      .andWhere('post_id = :post_id', {post_id: postId})
      .getOne()
    response['comment'] = comment
    response['status'] = 'ok'
    response['msg'] = '获取成功'
    return response
  },
  getCommentList: async options => {
    let response = {
      status: 'unknown',
      msg: '未知错误'
    }
    const entityManager = getManager()
    const id = options.id
    const pageSize = 3
    const pageIndex = Utils.getRowIndex(options.page, pageSize)
    let comment
    let _count
    _count = await entityManager.getRepository(Comment).createQueryBuilder('comment')
      .select('COUNT(*)','count')
      .where('post_id = :id',{id})
      .getRawOne()
    comment = await entityManager.getRepository(Comment).createQueryBuilder('comment')
      .select(['comment.id', 'comment.content', 'comment.comment_date', 'comment.user_id'])
      .where('post_id = :id',{id})
      .skip(pageIndex)
      .take(pageSize)
      .orderBy('comment.id',"DESC")
    comment = await comment.getMany()
    for (let i = 0; i < comment.length; i++) {
      let v = comment[i]
      const profile = await UserDao.profileByID(v.user_id)
      delete v.user_id
      v.user = {
        id: profile.id,
        nickname: profile.nickname,
        username: profile.username,
        avatar_img: 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/avatar_img/' + profile.uuid,
        banner_img: 'https://' + env.cos.assetsDomain + '/' + env.cos.remoteBasePath + 'user/banner_img/' + profile.uuid
      }
      v.comment_date = Utils.DateFormatter(v.comment_date,false)
    }
    response['comment'] = comment
    response['status'] = 'ok'
    response['msg'] = '获取成功'
    response['page_count'] = Math.ceil(Number(_count.count) / pageSize)
    return response
  }}
