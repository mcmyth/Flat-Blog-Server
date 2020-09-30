export const DateFormatter = function(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return [date.getFullYear(),
        '-' + (month>9 ? '' : '0') + month,
        '-' + (day>9 ? '' : '0') + day,
        ' '+ (hours>9 ? '' : '0') + hours,
        ':'+ (minutes>9 ? '' : '0') + minutes,
        ':'+ (seconds>9 ? '' : '0') + seconds,
    ].join('');
};

