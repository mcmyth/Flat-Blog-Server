export {}
import {Router} from 'express'
import {env} from '../../config/env'
import {UserDao} from "../../dao/User"

const Utils = require('../../lib/Utils')
const formidable = require('formidable')
const router = Router();
const UploadBanner = require('../../lib/UploadImg')
router.post('/upload', async (req: any, res: any) => {
  let response = {
    status: 'unknown',
    msg: '未知错误',
    link: null
  }
  const allowType = ['banner_img','avatar_img']
  let token = req.headers.authorization
  const user: any = await UserDao.profileByToken(token)
  if (user.status === 'ok') {
    const form = new formidable.IncomingForm()
    form.parse(req, async function (err, fields, files) {
      if (files !== undefined) {
        const keyName = Object.getOwnPropertyNames(files)[0]
        const oldPath = files[keyName].path
        const fileName = oldPath.substring(oldPath.lastIndexOf('\\') + 1)
        const newPath = env.cos.localBasePath + fileName
        const fileSize = Number((files[keyName].size / 1024).toFixed(2))
        if (fileSize > 8192) {
          response.msg = '文件大小不得超过8MB'
          response.status = 'error'
          res.send(response)
          return
        }
        if (Utils.lookupArrayKey(allowType, keyName) === false) {
          response.msg = '该文件类型不存在'
          response.status = 'error'
          res.send(response)
          return
        }
          UploadBanner.send(res, {
            oldPath,
            newPath,
            user,
            fileName,
            keyName,
            response
          })
      } else {
        response.msg = '参数缺失'
        response.status = 'error'
        res.send(response)
      }
    });
  }
});

module.exports = router;
