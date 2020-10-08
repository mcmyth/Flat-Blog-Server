import {getManager} from 'typeorm'
import {Media} from '../entity/Media'
import {jwtConfig} from '../config/blog.config'
import {DateFormatter} from "../lib/Utils";
const jwt = require('jsonwebtoken')
export const MediaDao = {
  newMedia: async (token, filename, size, folder?) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      uuid: null
    }
    const entityManager = getManager()
    let media = new Media()
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
    media.user_id = user_id
    media.filename = filename
    media.folder = folder
    media.size = size
    media.upload_date = DateFormatter(new Date())
    const mediaInfo = await entityManager.save(Media, media)
    response.status = 'ok'
    response.msg = '上传成功'
    response.uuid = mediaInfo.uuid
    return response
  }
}
