import { env } from '../config/env'
import { webBaseURL } from '../config/blog.config'

const nodemailer = require('nodemailer')

let smtpTransport = require('nodemailer-smtp-transport')
smtpTransport = nodemailer.createTransport(smtpTransport({
  host: "smtp.exmail.qq.com",
  port:465,
  auth: {
    user: env.email.user,
    pass: env.email.pass
  }
}))

export const sendMail = async (form, to, subject, html) => {
  return new Promise((resolve,reject) => {
    smtpTransport.sendMail({
      from: `"${form}" ${env.email.user}`,
      to,
      subject,
      html
    }, (error, response) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(response)
    })
  })
}

export const sendCaptchaKey = async (to, captchaKey, user, type) => {
  let verificationLink, description, subject
  if (type === 'email') {
    verificationLink = `${webBaseURL}verification?type=email&id=${user.id}&code=${captchaKey}`
    description = '我们收到了来自您账户的邮箱验证请求,点击链接或按钮以通过验证<br/>如果您不知道这是什么或对此不知情,请不要点击<br/>(10分钟内有效)'
    subject = '邮箱验证 - MC Myth Blog'
  }
  if (type === 'password') {
    verificationLink = `${webBaseURL}pwd?type=password&id=${user.id}&code=${captchaKey}`
    description = '我们收到了来自您账户的更改密码请求,点击链接或按钮以更改密码<br/>如果您不知道这是什么或对此不知情,请不要点击<br/>(10分钟内有效)'
    subject = '更改密码 - MC Myth Blog'
  }
  const template = `<div style="max-width:600px;margin: 0 auto;box-shadow: rgba(0, 0, 0, 0.09) 5px 5px 0px;border-radius:5px;overflow: hidden; "><div style="background-color: #2196f3;padding:15px 15px 15px 15px;font-size:18px;font-family:'微软雅黑';    box-shadow: rgba(33, 150, 243, 0.3) 0px 4px 0px;
   "><a style="text-decoration: none;color:#fff;" href="${webBaseURL}">MC Myth</a></div>
<div style="text-align:center;color:#666;margin:25px 5px 25px 5px;"><h3>Hi,${user.username}!
</h3>
    <div>${description}</div>
    <br/>您的邮箱验证链接为:</b><a style="color: #1b6fcc;" href="${verificationLink}"">${verificationLink}</a><br/>
    <hr style="margin:20px;"/>
    或者点击按钮<p><a href="${verificationLink}"
                style="font-size:13px;cursor:pointer;padding:10px 55px;height: 40px;width: 120px;background-color: #2196f3;color: #FFF;border: none;border-radius: 3px;text-decoration: none;">验证邮箱</a>
    </p><span style="font-size: 11px;color: #666">*本邮件由系统自动发送,请勿回复</span></div>
<div style="background-color:#2196f3;padding:10px 10px 10px 10px;font-size:14px;font-family:'微软雅黑';color:#fff;text-align:center;">
    © ${new Date().getFullYear()} MC MYTH
</div></div>`
  const mail = {
    form: 'CaptchaKey',
    to,
    subject,
    html: template
  }
  return await sendMail(mail.form, to, mail.subject, mail.html)
}
