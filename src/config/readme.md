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
     port: 'Your Port',
     user: 'Your Email',
     pass: 'Your Password'
   },
 database: {
     host: "Your Mysql Host",
     port: 3306,
     username: "root",
     password: "Your Mysql Password",
     database: "Your Mysql Database",
 }
}
~~~

This config is using to connect to Tencent Cloud COS and send email.
