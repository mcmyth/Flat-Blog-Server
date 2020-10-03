const svgCaptcha = require('svg-captcha')
export default function () {
  const captcha = svgCaptcha.createMathExpr({
    background: '#' + Math.random().toString(16).substr(-6),
    noise: 15,
    color: true
  });
  return {
    text: captcha.text,
    data: captcha.data,
  }
}
