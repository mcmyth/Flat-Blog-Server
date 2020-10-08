import {getManager} from 'typeorm'
import {Media} from '../entity/Media'
import {DateFormatter} from "../lib/Utils";

const Utils = require('../lib/Utils')

export const MediaDao = {
  newMedia: async (token, filename, size, folder?) => {
    let response = {
      status: 'unknown',
      msg: '未知错误',
      uuid: null
    }
    const entityManager = getManager()
    let media = new Media()
    const profile = await Utils.getProfileByToken(token)
    if (profile.status === 'error') return profile
    media.user_id = profile.id
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
