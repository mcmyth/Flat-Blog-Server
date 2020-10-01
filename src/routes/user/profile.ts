export {}
import {Router} from 'express'
const router = Router();
const cookieParser = require('cookie-parser')
import {UserDao} from "../../data/User"
router.get('/profile',function(req:any,res:any){
    UserDao.profile(req.cookies['token']).then(response => {
        res.json(response)
    })

});
module.exports = router;
