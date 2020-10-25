 # Flat-Blog-Server

   ![npm version](https://img.shields.io/badge/npm-6.14.6-blue)
   ![typeorm version](https://img.shields.io/badge/typeorm-0.2.26-blue)
   ![express version](https://img.shields.io/badge/express-4.17.1-blue)
   ![license](https://img.shields.io/badge/license-MIT-brightgreen)

   **前端请移步到[Flat-Blog](https://github.com/mcmyth/Flat-Blog)**

   基于Express,采用TypeORM进行数据库管理

   Demo: [https://blog.mc-myth.cn](https://blog.mc-myth.cn)

   ### 安装

   ```
   npm install
   ```

   ### 启动

   ```
   npm run start
   ```

   ### 配置项目

   #### 基本配置

   ##### 配置后端api的URL

   在`src/config/blog.config.js`中配置jwt/session/cross相关信息

   #### 配置COS

   用于存储用户头像/头图/文章文件上传到[腾讯云对象储存](https://cloud.tencent.com/product/cos)

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
         user: 'Your Email',
         pass: 'Your Password'
       }
   }
   ~~~

