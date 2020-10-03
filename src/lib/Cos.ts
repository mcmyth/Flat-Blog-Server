const fs = require('fs')
const COS = require('cos-nodejs-sdk-v5')
import {env} from '../config/env'

export const cos = new COS({
  SecretId: env.cos.secretId,
  SecretKey: env.cos.secretKey
});

export const put = (localFilename, remoteFilename) => {
  return new Promise(resolve => {
    cos.putObject({
      Bucket: env.cos.Bucket,
      Region: env.cos.Region,
      Key: env.cos.remoteBasePath + remoteFilename,
      StorageClass: 'STANDARD',
      Body: fs.createReadStream(env.cos.localBasePath + localFilename),
      onProgress: function (progressData) {
        //console.log(JSON.stringify(progressData));
      }
    }, (err, data) => {
      resolve(err || data)
    });
  })
}

export const del = (remoteFilename) => {
  return new Promise(resolve => {
    cos.putObject({
      Bucket: env.cos.Bucket,
      Region: env.cos.Region,
      Key: env.cos.remoteBasePath + remoteFilename,
      StorageClass: 'STANDARD'
    }, (err, data) => {
      resolve(err || data)
    });
  })
}
