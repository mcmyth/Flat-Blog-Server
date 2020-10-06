export const lookupArrayKey = (arr: Array<string>, name: string) => {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === name) return true
  }
  return false
}

export const DateFormatter = function (date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return [date.getFullYear(),
    '-' + (month > 9 ? '' : '0') + month,
    '-' + (day > 9 ? '' : '0') + day,
    ' ' + (hours > 9 ? '' : '0') + hours,
    ':' + (minutes > 9 ? '' : '0') + minutes,
    ':' + (seconds > 9 ? '' : '0') + seconds,
  ].join('');
}

export const usernameIsValid = v => /^((?=.*[A-Z])|(?=.*[a-z]))[0-9a-zA-Z_]{3,10}$/.test(v)

export const passwordIsValid = v => /^(?=.*[0-9])(?=.*[a-zA-Z!@#$%^&*?+_])[a-zA-Z0-9!@#$%^&*?+_]{6,16}$/.test(v)

export const emailIsValid = v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
