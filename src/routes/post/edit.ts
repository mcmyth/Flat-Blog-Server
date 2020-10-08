export {}
import {Router} from 'express'
import {PostDao} from '../../dao/Post'
import {env} from "../../config/env";
import {uploadFile} from "../../lib/UploadFile";

const router = Router()
const formidable = require('formidable')

router.post('/edit', async (req: any, res: any) => {
  let response: any = {
    status: 'unknown',
    msg: '未知错误',
    link: null
  }
  const form = new formidable.IncomingForm()
  const srvCaptchaKey = req.session.captchaKey
  form.parse(req, async function (err, fields, files) {
    const cliCaptchaKey = fields.captchaKey
    if (srvCaptchaKey !== undefined && srvCaptchaKey === cliCaptchaKey) {
      const id = fields.id
      const title = fields.title
      const content = fields.content
      const token = req.headers.authorization
      if (id === 'new') {
        response = await PostDao.newPost(token, title, content)
      } else {
        response = await PostDao.updatePost(id, token, title, content)
        if (response.status === 'error') {
          res.json(response)
          return
        }
      }
      const postId = response.post_uuid
      // Upload banner to cos
      if (Object.keys(files).length !== 0) {
        const oldPath = files['header_img'].path
        const fileName = oldPath.substring(oldPath.lastIndexOf('\\') + 1)
        const newPath = env.cos.localBasePath + fileName
        const fileSize = Number((files['header_img'].size / 1024).toFixed(2))
        if (fileSize > 8192) {
          response.msg = '文件大小不得超过8MB'
          response.status = 'error'
          res.send(response)
          return
        }
        uploadFile.postBanner(res, {
          postId,
          oldPath,
          newPath,
          fileName,
          response
        })
      } else {
        res.json(response)
      }
    } else {
      res.json({
        status: 'error',
        msg: '验证码错误'
      })
    }
  })
})

router.get('/edit', async (req: any, res: any) => {
  const id = req.query.id
  const post = await PostDao.getPost(id)
  res.send(post)
})
module.exports = router;
