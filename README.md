## 技术栈

- Vue 3 (Composition API)
- Vue Router 4
- Pinia (状态管理)
- Axios (HTTP 请求)
- Vite (构建工具)

## 项目结构

```
src/
├── api/              # API 接口
│   ├── auth.js      # 认证相关
│   ├── user.js      # 用户相关
│   ├── article.js   # 文章相关
│   ├── comment.js   # 评论相关
│   ├── like.js      # 点赞相关
│   ├── favorite.js  # 收藏相关
│   ├── follow.js    # 关注相关
│   ├── tag.js       # 标签相关
│   └── upload.js    # 文件上传
├── components/      # 公共组件
│   └── Layout.vue   # 布局组件
├── mock/            # Mock 数据（开发环境使用）
│   ├── data.js     # 模拟数据
│   └── index.js    # Mock API 实现
├── router/          # 路由配置
│   └── index.js
├── stores/          # 状态管理
│   └── user.js      # 用户状态
├── utils/           # 工具函数
│   └── request.js   # Axios 配置
└── views/           # 页面组件
    ├── Home.vue           # 首页
    ├── Login.vue          # 登录页
    ├── Register.vue       # 注册页
    ├── ArticleDetail.vue  # 文章详情
    ├── ArticleEdit.vue    # 文章编辑
    ├── Profile.vue        # 个人中心
    ├── Favorites.vue      # 收藏列表
    └── Admin.vue          # 管理后台
```

## 安装依赖

```bash
npm install
```

## 开发

```bash
npm run dev
```

## Mock 模式

项目默认在开发环境下启用 Mock 模式，无需后端即可运行和测试。

### 测试账号

- **邮箱**: `mike@example.com` 或 `alice@example.com`
- **密码**: `123456`

### 禁用 Mock 模式

如果需要连接真实后端，可以修改 `src/mock/index.js` 中的 `USE_MOCK` 常量：

```javascript
const USE_MOCK = false  // 禁用 Mock 模式
```

### 配置 API 地址

如果需要修改后端 API 地址，可以修改 `src/utils/request.js` 中的 `baseURL`：

```javascript
const request = axios.create({
  baseURL: 'http://localhost:8080',  // 修改为你的后端地址
  timeout: 10000,
})
```

## 构建

```bash
npm run build
```

## 使用说明

1. 运行 `npm run dev` 启动前端开发服务器
2. 访问 `http://localhost:5173` 查看应用
