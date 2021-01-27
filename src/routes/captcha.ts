import svgCaptcha from '../lib/Captcha'
import {Router} from 'express'

const router = Router()
declare module "express-session" {
  interface Session {
    captchaKey: string;
  }
}

router.get('/', (req, res) => {
  const captcha = svgCaptcha()
  req.session.captchaKey = captcha.text
  res.type('svg');
  res.status(200).send(captcha.data);
  res.end()
});
module.exports = router;
