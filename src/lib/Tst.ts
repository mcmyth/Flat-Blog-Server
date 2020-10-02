var STS = require('qcloud-cos-sts');
import { env } from '../config/env';
// 配置参数
var config = {
    secretId: env.cos.secretId,   // 固定密钥
    secretKey: env.cos.secretKey,  // 固定密钥
    proxy: '',
    durationSeconds: 1800,  // 密钥有效期
    // 放行判断相关参数
    bucket: env.cos.Bucket, // 换成你的 bucket
    region: env.cos.Region, // 换成 bucket 所在地区
    allowPrefix: 'test/*' // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
};

// getPolicy
// 获取临时密钥
export function getPolicy(callback) {
    var scope = [{
        action: 'name/cos:PutObject',
        bucket: config.bucket,
        region: config.region,
        prefix: 'exampleobject',
    }];
    var policy = STS.getPolicy(scope);
    STS.getCredential({
        secretId: config.secretId,
        secretKey: config.secretKey,
        proxy: config.proxy,
        policy: policy,
        durationSeconds: config.durationSeconds,
    }, (err, credential) => callback(err, credential));
}
