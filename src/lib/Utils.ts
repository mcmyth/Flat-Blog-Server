import {jwtConfig} from '../config/blog.config'
const trimHtml = require('trim-html')
const jwt = require('jsonwebtoken')

export const lookupArrayKey = (arr: Array<string>, name: string) => {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === name) return true
  }
  return false
}

export const DateFormatter = function (date, needTime = true) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  if (needTime) {
    return [date.getFullYear(),
      '-' + (month > 9 ? '' : '0') + month,
      '-' + (day > 9 ? '' : '0') + day,
      ' ' + (hours > 9 ? '' : '0') + hours,
      ':' + (minutes > 9 ? '' : '0') + minutes,
      ':' + (seconds > 9 ? '' : '0') + seconds
    ].join('')
  } else {
    return [date.getFullYear(),
      '-' + (month > 9 ? '' : '0') + month,
      '-' + (day > 9 ? '' : '0') + day].join('')
  }
}

export const usernameIsValid = v => /^((?=.*[A-Z])|(?=.*[a-z]))[0-9a-zA-Z_]{3,10}$/.test(v)

export const passwordIsValid = v => /^(?=.*[0-9])(?=.*[a-zA-Z!@#$%^&*?+_])[a-zA-Z0-9!@#$%^&*?+_]{6,16}$/.test(v)

export const emailIsValid = v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)

export const parseToText = str => {
  str = str.replace('\n', '')
  str = str.replace(/<audio[\w\W]+?>(.*)<\/audio>/g, '[音频]')
  str = str.replace(/<code [\w\W]+?>(.*)<\/code>/g, '[代码]')
  str = str.replace(/<img[\w\W]+?>/g, '[图片]')
  str = str.replace(/<[^>]*>/g, '')
  return str
}

export const getRowIndex = (pageNum: number, pageSize: number = 10) => (pageNum > 0) ? (pageNum - 1) * pageSize : 0

export const getProfileByToken = async token => {
  try {
    const raw = String(token).split(' ').pop()
    const user = await jwt.verify(raw, jwtConfig.secret)
    user['status'] = 'ok'
    user['msg'] = '获取成功'
    return user
  } catch (err) {
    let msg = err.message
    if (err.message === 'jwt malformed' || err.message === 'jwt expired')
      msg = '未登录或令牌已过期'
    return {
      status: 'error',
      msg: msg
    }
  }
}

export const signJwt = profile => {
  return 'Bearer ' + jwt.sign(profile, jwtConfig.secret, {expiresIn: jwtConfig.expiresIn})
}

export const randomId = (length = 5) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const simpleDescription = (html: string, length: number = 300) => {
  let tHtml = trimHtml(html, {
    limit: 200,
    preserveTags: true
  })
  let description = parseToText(tHtml.html)
  if (description.length > 300) description = description.slice(0,length) + '...'
  return description
}
