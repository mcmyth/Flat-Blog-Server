**Create a new file here**

`env.ts`

~~~typescript
export const env = {
 cos: {
     secretId: 'Your secretId',
     secretKey: 'Your secretKey',
     Bucket: 'Your Bucket',
     Region: 'Your Region',
     remoteBasePath: 'static/',
     localBasePath: 'static/',
     assetsDomain: 'Your COS Custom Domain'
   },
 email: {
     host: 'Your Host',
     port: 'Your Port'
     user: 'Your Email',
     pass: 'Your Password'
   }
}
~~~

This config is using to connect to Tencent Cloud COS and send email.
