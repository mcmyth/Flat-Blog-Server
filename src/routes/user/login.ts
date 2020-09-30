export {}
import {Router} from 'express'
const jwt = require('jsonwebtoken')
const router = Router();
router.post('/',function(req:any,res:any){
    const srvCaptchaKey = req.session.captchaKey
    const cliCaptchaKey = req.body.captchaKey
    if (srvCaptchaKey !== undefined && srvCaptchaKey === cliCaptchaKey) {
        res.json({
            status: 'ok',
            msg: 'ok',
            data: { token: String('xxx') }
        })
    }else
    {
        res.json({
            status: 'error',
            msg: 'Invalid captcha',
            data: { token: null }
        })
    }
    req.session.captchaKey = undefined
});
module.exports = router;
