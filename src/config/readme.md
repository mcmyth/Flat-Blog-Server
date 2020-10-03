**Create a new file here**

`env.ts`

```typescript
export const env = {
  cos: {
      secretId: 'Your secretId',
      secretKey: 'Your secretKey',
      Bucket: 'Your Bucket',
      Region: 'Your Region',
      remoteBasePath: 'static/',
      localBasePath: 'static/',
      assetsDomain: 'Your COS Custom Domain'
    }
}
```

This config is used to connect to Tencent Cloud COS
