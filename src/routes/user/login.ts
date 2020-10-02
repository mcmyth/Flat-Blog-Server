export {}
import {Router} from 'express'
const router = Router();
import {UserDao} from "../../dao/User"
router.post('/login',function(req:any,res:any){
    const srvCaptchaKey = req.session.captchaKey
    const cliCaptchaKey = req.body.captchaKey
    const data = req.body
    if (srvCaptchaKey !== undefined && srvCaptchaKey === cliCaptchaKey) {
        UserDao.login(data.username,data.password).then(response => {
            res.json(response)
        })
    }else
    {
        res.json({
            status: 'error',
            msg: '验证码错误'
        })
    }
    req.session.captchaKey = undefined
});
module.exports = router;
