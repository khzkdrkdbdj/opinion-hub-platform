# OpinionHub静态部署指南

## ✅ 静态构建完成！

OpinionHub前端已经成功打包为静态文件，可以部署到任何静态托管服务。

### 📁 构建结果

#### 生成的文件
- **输出目录**：`opinion-hub-frontend/out/`
- **主页面**：`out/index.html`
- **演示页面**：`out/demo/index.html`
- **静态资源**：`out/_next/static/`

#### 构建统计
```
Route (app)                                 Size  First Load JS
┌ ○ /                                     118 kB         391 kB
├ ○ /_not-found                            999 B         103 kB
└ ○ /demo                                5.99 kB         278 kB
+ First Load JS shared by all             102 kB
```

### 🌐 部署选项

#### 1. **Vercel部署**
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署到Vercel
cd opinion-hub-frontend
vercel --prod
```

#### 2. **Netlify部署**
```bash
# 安装Netlify CLI
npm i -g netlify-cli

# 部署到Netlify
cd opinion-hub-frontend
netlify deploy --prod --dir=out
```

#### 3. **GitHub Pages部署**
```bash
# 将out目录内容推送到gh-pages分支
cd opinion-hub-frontend/out
git init
git add .
git commit -m "Deploy OpinionHub static site"
git branch -M gh-pages
git remote add origin <your-repo-url>
git push -u origin gh-pages
```

#### 4. **AWS S3 + CloudFront**
```bash
# 使用AWS CLI上传到S3
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### 5. **IPFS部署**
```bash
# 使用IPFS部署去中心化网站
ipfs add -r out/
# 获取IPFS哈希并通过IPFS网关访问
```

### 🔧 本地测试

#### 使用内置服务器
```bash
cd opinion-hub-frontend
npm run serve
# 访问: http://localhost:3000
```

#### 使用Python服务器
```bash
cd opinion-hub-frontend/out
python3 -m http.server 8000
# 访问: http://localhost:8000
```

#### 使用Node.js服务器
```bash
cd opinion-hub-frontend
npx serve out -p 3000
# 访问: http://localhost:3000
```

### ⚙️ 环境配置

#### 网络配置
静态站点会根据`.env.local`中的配置连接到相应的网络：

**当前配置（Sepolia）**：
```bash
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia
NEXT_PUBLIC_RELAYER_URL=https://relayer.sepolia.zama.ai
NEXT_PUBLIC_INFURA_API_KEY=78e2c8be8a32466cae545f06ebc780c1
```

**本地开发配置**：
```bash
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_NETWORK_NAME=localhost
NEXT_PUBLIC_RELAYER_URL=http://localhost:8545
```

#### 合约地址
静态站点自动从ABI文件加载合约地址：
- **Localhost**：`0x5c653ca4AeA7F2Da07f0AABf75F85766EAFDA615`
- **Sepolia**：`0x19F3581962E2D120107F0aF7817e7cdb32369Be6`

### 🚀 部署后功能

#### ✅ 完整功能支持
- **钱包连接**：MetaMask集成
- **调研浏览**：查看所有调研
- **调研创建**：Launch Survey功能
- **参与调研**：FHEVM加密响应提交
- **访问管理**：限制访问调研的权限控制
- **数据分析**：Analytics仪表板
- **结果解密**：FHEVM解密功能
- **用户反馈**：内置反馈系统

#### 🌐 网络支持
- **Sepolia测试网**：公开测试和演示
- **本地开发**：开发和测试环境
- **自动切换**：根据环境变量自动连接

### 📊 当前部署状态

#### Sepolia测试网数据
- **合约地址**：`0x19F3581962E2D120107F0aF7817e7cdb32369Be6`
- **区块链浏览器**：https://sepolia.etherscan.io/address/0x19F3581962E2D120107F0aF7817e7cdb32369Be6
- **测试调研**：
  1. "Blockchain Adoption" (开放访问)
  2. "DeFi vs Traditional Finance" (限制访问)

#### 静态站点特性
- **完全客户端**：所有逻辑在浏览器中运行
- **无服务器依赖**：可以部署到任何静态托管
- **快速加载**：优化的静态资源
- **SEO友好**：预渲染的HTML页面

### 🎯 推荐部署方案

#### 开发/测试环境
- **Vercel**：最简单的部署，自动CI/CD
- **Netlify**：优秀的静态站点托管
- **GitHub Pages**：免费的开源项目托管

#### 生产环境
- **AWS S3 + CloudFront**：企业级CDN和缓存
- **IPFS**：去中心化部署，符合Web3精神
- **自定义CDN**：完全控制的部署方案

### 🔐 安全考虑

#### 环境变量
- 确保生产环境使用正确的网络配置
- 保护好Infura API密钥等敏感信息
- 使用HTTPS确保安全连接

#### 智能合约
- Sepolia合约已验证并公开
- 支持完整的FHEVM加密功能
- 所有权限和访问控制正常工作

OpinionHub现在已经完全准备好进行静态部署！🚀

您可以选择任何静态托管服务来部署这个去中心化的民意调研平台。
