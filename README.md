# 狸花猫后台管理系统 App 端（lihua-app）

> 基于 **UniApp + Vue3 + TypeScript** 的移动端，适配 **Android / iOS / 鸿蒙 / 微信小程序**

[![Gitee Stars](https://gitee.com/yukino_git/lihua-app/badge/star.svg?theme=dark)](https://gitee.com/yukino_git/lihua-app/stargazers)

## 🧩 项目仓库

**3.0 起项目按端拆分为四个独立仓库**，共用统一的账号、权限与数据模型，可按需组合使用：

| 仓库 | 说明 | 地址 |
|------|------|------|
| lihua | 后端 · Spring Boot 单体版 | https://gitee.com/yukino_git/lihua |
| lihua-cloud | 后端 · Spring Cloud 微服务版 | https://gitee.com/yukino_git/lihua-cloud |
| lihua-web | 前端 · Vue3 管理端（Antdv Next 组件库） | https://gitee.com/yukino_git/lihua-web |
| lihua-app | 移动端 · UniApp（本仓库） | https://gitee.com/yukino_git/lihua-app |

> 本仓库可同时对接单体版与微服务版后端，仅需修改后端地址配置。

## 📚 文档

- 📖 开发文档：https://doc.lihua.xyz（含 1.0 / 2.0 / 3.0 全版本）

## 💬 交流反馈

- 欢迎提交 Issues（功能建议 / Bug / 优化建议）
- QQ 交流群：850464676

## 🛠 主要技术栈

- uni-app + Vue 3.5 + TypeScript（CLI 工程，可配合 HBuilderX 运行）
- sard-uniapp（UI 组件库）
- @uni-ku/root（虚拟根组件，全局逻辑集中处理）
- Pinia 3 状态管理
- crypto-js（记住密码 AES 加密）

## ✨ 功能特性

- 🔐 **注册登录**：密码加解密、记住密码、tianai 滑块验证码，注册与验证码开关由 Web 端统一控制
- 🛡️ **权限体系**：角色 / 权限标识 / 部门标识，`user store` 直接获取；登录后信息完善向导
- 🔔 **通知公告**：WebSocket 实时推送，App 端原生横幅提醒，未读数 tabBar 红点
- 📎 **附件上传**：秒传 / 分片，H5 / App / 小程序分平台归一层统一出口
- 🌗 **暗色模式**：App 手动切换，小程序跟随系统
- 📦 **主包 + 分包**：设置 / 通知 / 用户设置按分包加载，进入个人中心预下载

## 📁 目录结构

``` bash
lihua-app/
├── src/
│   ├── pages/              # 主包页面（登录 / 注册 / 首页 / 个人中心 / 向导等）
│   ├── subpackages/        # 分包（设置 / 通知 / 用户设置 / 协议 / 组件演示）
│   ├── components/         # 业务组件（附件上传 / 字典标签 / 下拉刷新 / 验证码等）
│   ├── api/                # 接口层（App 专用后端接口，/app 前缀）
│   ├── stores/             # Pinia（user / notice / theme / dict / setting / root）
│   ├── router/             # sard Router 封装 + 路由守卫 + 公开路由表
│   ├── helpers/            # token / 字典 / 记住密码 / 原生通知 / tabBar 红点
│   ├── utils/              # 请求封装 / WebSocket / 附件分平台归一层（platform/h5|app|mp）
│   ├── App.vue             # 全局 WebSocket 监听接线层
│   └── AppRoot.vue         # 虚拟根组件（@uni-ku/root）
├── pages.json              # 页面路由与 tabBar（含条件编译）
├── manifest.json           # 应用清单（全端 darkmode + theme.json）
└── .env.development        # 后端地址（VITE_APP_BASE_API / VITE_APP_WS_API）
```

## 🚀 快速开始

```sh
# 安装依赖（Node.js 22+）
npm install

# H5 开发模式
npm run dev:h5

# 微信小程序开发模式
npm run dev:mp-weixin
```

- **App 端**：使用 HBuilderX 导入工程作为运行容器 / 真机基座（含鸿蒙签名配置）
- **后端地址**：修改 `.env.development` 中 `VITE_APP_BASE_API` 与 `VITE_APP_WS_API`

默认账号密码：`admin` / `123456`
