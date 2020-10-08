import {env} from '../config/env'
import {put} from './Cos'
import {URL} from 'url'
import {PostDao} from "../dao/Post";

const fs = require('fs')
const webp = require('webp-converter')
const uuid = require('uuid')

export class uploadFile {
  static userBanner(res, options) {
    fs.rename(options.oldPath, options.newPath, async err => {
      if (!err) {
        const webpName = options.user.uuid + '_' + options.keyName + '.webp'
        const webpPath = env.cos.localBasePath + webpName
        const webpResponse = await webp.cwebp(options.newPath, webpPath, "-q 80")
        if (webpResponse.search('NOT_ENOUGH_DATA') !== -1) {
          options.response.msg = '请上传正确的图片格式'
          options.response.status = 'error'
          res.send(options.response)
          return
        }
        const cosResponse: any = await put(webpName, 'user/' + options.keyName + '/' + options.user.uuid)
        if (cosResponse.statusCode === 200) {
          options.response.msg = '数据上传成功'
          options.response.status = 'ok'
          let link: string | URL = 'https://' + cosResponse.Location
          link = new URL(link)
          link.hostname = env.cos.assetsDomain
          options.response.link = link
        } else {
          options.response.msg = '数据上传失败'
          options.response.status = 'error'
        }
        fs.unlink(options.newPath, error => {})
        fs.unlink(webpPath, error => {})
        res.send(options.response)
      }
    })
  }
  static postBanner (res,options) {
     fs.rename(options.oldPath, options.newPath, async err => {
      if (!err) {
        const webpName = options.postId + '_post.webp'
        const webpPath = env.cos.localBasePath + webpName
        const webpResponse = await webp.cwebp(options.newPath, webpPath, "-q 80")
        if (webpResponse.search('NOT_ENOUGH_DATA') !== -1) {
          options.response.msg = '请上传正确的图片格式'
          options.response.status = 'error'
          res.send(options.response)
          return
        }
        const cosResponse: any = await put(webpName, 'post/banner/' + options.postId)
        if (cosResponse.statusCode === 200) {
          let bannerLink: string | URL | null = null
          bannerLink = 'https://' + cosResponse.Location
          bannerLink = new URL(bannerLink)
          bannerLink.hostname = env.cos.assetsDomain
          options.response.banner_img = bannerLink
          if(bannerLink === null) {
            res.send(options.response)
          } else {
            await PostDao.insertBanner(options.postId, bannerLink)
            options.response['banner_img'] = bannerLink
            res.send(options.response)
          }
        }
      }
    })
  }
  static media (res,options) {
    let response:any = {
      status: 'unknown',
      msg: '未知错误',
      data: {
        succMap: {}
      }
    }
    fs.rename(options.oldPath, options.newPath, async err => {
      const cosResponse: any = await put(options.fileId, 'media/' + options.fileId)
      if (cosResponse.statusCode === 200) {
        let fileLink: string | URL | null = null
        fileLink = 'https://' + cosResponse.Location
        fileLink = new URL(fileLink)
        fileLink.hostname = env.cos.assetsDomain
        response.msg = '上传成功'
        response.status = 'ok'
        const originalName = options.originalName
        response.data.succMap[originalName] = fileLink
        fs.unlink(options.newPath, err => {
        })
        res.send(response)
      }
    })
  }
}
