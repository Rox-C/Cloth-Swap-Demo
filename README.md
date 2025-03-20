"Cloth Swap Demo" 

# Cloth Swap Demo

一个基于 React 的在线服务装平台，集成了虚拟试衣功能。

## 功能特点

- 用户注册和登录系统
- 商品浏览和详情展示
- 购物车管理
- 个人衣橱功能
- AI 虚拟换衣功能（由 [OOTDiffusion](https://github.com/levihsu/OOTDiffusion) 提供支持）

## 安装和运行

### 前置要求

- Node.js (v14.0.0 或更高版本)
- MySQL 数据库
- Python 3.8+ (用于运行 OOTDiffusion 服务)

### 安装步骤

1. 克隆项目并安装依赖：
```bash
git clone https://github.com/Rox-C/Cloth-Swap-Demo.git
cd simple-ecommerce-demo/client
npm install
```

2. 配置数据库：
   - 在 MySQL 中创建名为 `simple_ecommerce` 的数据库
   - 修改 `backend/server.js` 中的数据库配置

3. 启动后端服务：
```bash
cd backend
npm install
node server.js
```

4. 启动前端服务：
```bash
cd client
npm start
```

5. 配置 OOTDiffusion 服务：
   - 按照 [OOTDiffusion](https://github.com/levihsu/OOTDiffusion) 的说明安装和配置
   - 确保 OOTDiffusion 服务运行在 `http://localhost:7865`

### 使用说明

1. 访问 `http://localhost:3000` 打开应用
2. 注册新用户或使用现有账号登录
3. 浏览商品列表，可以：
   - 查看商品详情
   - 将商品添加到购物车
   - 将商品添加到个人衣橱
4. 在衣橱中使用虚拟试衣功能：
   - 选择模特
   - 选择要试穿的衣服
   - 点击"试穿"按钮生成效果

## 技术栈

- 前端：React.js
- 后端：Express.js
- 数据库：MySQL
- 虚拟试衣：OOTDiffusion

## 注意事项

- 虚拟试衣功能需要确保 OOTDiffusion 服务正常运行
- 首次使用时需要正确配置数据库连接信息
- 建议使用 Chrome 或 Firefox 最新版本访问

## 致谢

特别感谢 [OOTDiffusion](https://github.com/levihsu/OOTDiffusion) 项目提供的虚拟试衣技术支持。