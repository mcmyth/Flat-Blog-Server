import {env} from "../../config/env";

export {}
import {Router} from 'express'
import {uploadFile} from '../../lib/UploadFile'
import {MediaDao} from '../../dao/Media'

const router = Router()
const formidable = require('formidable')

router.post('/media', async (req: any, res: any) => {
  let response:any = {
    status: 'unknown',
    msg: '未知错误',
    link: null
  }
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    if(Object.keys(files).length !== 0) {
      const file = 'file[]'
      const originalName = files[file].name
      const oldPath = files[file].path
      const fileName = oldPath.substring(oldPath.lastIndexOf('\\') + 1)
      const fileSize = Number((files[file].size / 1024).toFixed(2))
      if (fileSize > 4096) {
        response.msg = '文件大小不得超过4MB'
        response.status = 'error'
        res.send(response)
        return
      }
      const token = req.headers['x-upload-token']
      response = await MediaDao.newMedia(token,originalName, fileSize, 'post')
      if (response.status === 'ok') {
        const fileId = response.uuid
        const newPath = env.cos.localBasePath + fileId
        uploadFile.media(res,{
          oldPath,
          newPath,
          fileName,
          fileId,
          token,
          originalName
        })
      }
    }
  })
});
module.exports = router;
