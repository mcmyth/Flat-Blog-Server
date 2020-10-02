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
    console.log(user.status)
    const form = new formidable.IncomingForm()
    form.parse(req,function(err,fields,files){
        if(files !== undefined) {
            console.log()
            fs.rename(files.banner_img.path,env.cos.localBasePath + files.banner_img.name,async err => {
                if (!err){
                    // await put('','')
                }
            })
        }
    });
    res.send(response)
});

module.exports = router;
