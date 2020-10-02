export {}
import {Router} from 'express'
const router = Router();
import {put} from '../../lib/Cos'
router.all('/put',async function(req:any,res:any){
    res.send(await put('test.jpg','test.jpg'))
});

module.exports = router;
