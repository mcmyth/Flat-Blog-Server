export {}
import {Router} from 'express'
import { env } from '../../config/env'
import {put} from '../../lib/Cos'
import {UserDao} from "../../data/User"
const fs = require('fs')
const formidable = require('formidable')
const router = Router();
interface user {
    user:string
}
router.post('/upload',async function(req:any,res:any){
    let response = {
        status: 'unknown',
        msg: '未知错误'
    }
    let token = req.headers.authorization
    const user:any = await UserDao.profile(token)
    if(user.status === 'ok') {
        const form = new formidable.IncomingForm()
        form.parse(req,function(err,fields,files){
            if(files !== undefined) {
                const oldPath = files.banner_img.path
                const newPath = env.cos.localBasePath + files.banner_img.name
                const fileName = files.banner_img.name
                fs.rename(oldPath, newPath, async err => {
                    if (!err){
                        console.log(await put(fileName, 'user/banner/' + fileName))
                    }
                })
            }
        });
    }
    res.send(response)
});

module.exports = router;
