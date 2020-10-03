export {}
import {Router} from 'express'
import {env} from '../../config/env'
import {UserDao} from "../../dao/User"

const Utils = require('../../lib/Utils')
const formidable = require('formidable')
const router = Router();
const UploadBanner = require('../../lib/UploadBanner')
router.post('/upload', async function (req: any, res: any) {
  let response = {
    status: 'unknown',
    msg: '未知错误',
    link: null
  }
  const allowType = ['banner_img']
  let token = req.headers.authorization
  const user: any = await UserDao.profile(token)
  if (user.status === 'ok') {
    const form = new formidable.IncomingForm()
    form.parse(req, async function (err, fields, files) {
      if (files !== undefined) {
        const keyName = Object.getOwnPropertyNames(files)[0]
        const oldPath = files[keyName].path
        const fileName = oldPath.substring(oldPath.lastIndexOf('\\') + 1)
        const newPath = env.cos.localBasePath + fileName
        console.log(fileName);
        if (Utils.lookupArrayKey(allowType, keyName) === false) {
          response.msg = '该文件类型不存在'
          response.status = 'error'
          res.send(response)
          return
        }
        if (keyName === 'banner_img') {
          UploadBanner.send(res, {
            oldPath,
            newPath,
            user,
            fileName,
            keyName,
            response
          })
          return
        }
        res.send(response)
      } else {
        response.msg = '参数缺失'
        response.status = 'error'
        res.send(response)
      }
    });
  }
});

module.exports = router;
