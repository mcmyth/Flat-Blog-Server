import {env} from "../config/env"
import {put} from "./Cos"
import {URL} from "url"

const fs = require('fs')
const webp = require('webp-converter')
export const send = (res, options) => {
  fs.rename(options.oldPath, options.newPath, async err => {
    if (!err) {
      const webpName = options.user.uuid + '_'+ options.keyName +'.webp'
      const webpPath = env.cos.localBasePath + webpName
      const webpResponse = await webp.cwebp(options.newPath, webpPath, "-q 80")
      if (webpResponse.search('NOT_ENOUGH_DATA') !== -1) {
        options.response.msg = '请上传正确的图片格式'
        options.response.status = 'error'
        res.send(options.response)
        return
      }
      const cosResponse: any = await put(options.fileName, 'user/' + options.keyName + '/' + options.user.uuid)
      if (cosResponse.statusCode === 200) {
        options.response.msg = '数据上传成功'
        options.response.status = 'ok'
        let link: string | URL = 'https://' + cosResponse.Location
        link = new URL(link)
        link.hostname = 'assets.mc-myth.cn'
        options.response.link = link
        fs.unlink(options.newPath, error => {
        })
        fs.unlink(webpPath, error => {
        })
      } else {
        options.response.msg = '数据上传失败'
        options.response.status = 'error'
      }
      res.send(options.response)
    }
  })
}
