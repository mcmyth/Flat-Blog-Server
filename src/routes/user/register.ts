export {}
import {Router} from 'express'
import {DateFormatter} from "../../lib/date";
import {UserDao} from "../../data/User"
const router = Router();
router.post('/',function(req:any,res:any){
    const srvCaptchaKey = req.session.captchaKey
    const cliCaptchaKey = req.body.captchaKey
    if (srvCaptchaKey !== undefined && srvCaptchaKey === cliCaptchaKey) {
        const data = req.body
        const now = DateFormatter(new Date())
        UserDao.register(data.username, data.password, data.email, now).then(() => {
            res.json({
                status: 'ok',
                msg: '注册成功!',
            })
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
