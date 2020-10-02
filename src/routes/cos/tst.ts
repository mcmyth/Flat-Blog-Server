export {}
import {Router} from 'express'
const router = Router();
const tst = require('../../lib/Tst')
router.all('/tst',function(req:any,res:any){
    tst.getPolicy((err, credential) => {
        res.send(err || credential)
    })
});

module.exports = router;
