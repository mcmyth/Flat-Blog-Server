export {}
import { Router } from 'express'
const router = Router();
import { UserDao } from "../../dao/User"
router.get('/profile',function(req:any,res:any) {
    let token = req.headers.authorization
    UserDao.profile(token).then(response => {
        res.json(response)
    })
});
module.exports = router;
