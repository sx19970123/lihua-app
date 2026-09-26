---
name: init
description: 狸花猫脚手架移动端（lihua-app）的二次开发初始化步骤。通常由后端仓（lihua / lihua-cloud）的 init 流程统一驱动；单独初始化本仓时也可独立执行。覆盖：项目改名（按层级）、版本重置 1.0.0（versionName/versionCode）、承接功能裁剪（部门岗位/通知公告/组件演示页）。
---

# 二次开发初始化（lihua-app）

本仓是 UniApp 移动端（可选客户端）。**通常由后端仓的 init 统一驱动**（问卷与计划见后端仓 `skills/init.md`），本文件定义本仓的承接步骤；单独初始化本仓时按相同问卷口径独立执行。用户确认**不需要移动端**时不初始化本仓（App 端裁剪在后端侧执行）。

## 前置

- 生成 agent 入口指针（init 产物，脚手架仓库不携带）：根目录创建 `AGENTS.md`（列本仓 `skills/` 清单与用途、init 触发词）+ `CLAUDE.md`（一行 `@AGENTS.md`），后续会话由此发现 `skills/`。
- 全局问卷结果由驱动方传入；单独执行时先收集。

## 改名（按选定层级）

- **品牌层**：`src/manifest.json` name、首页亮暗徽章文案、登录页文案。
- **品牌+标识层**（加）：`package.json` name、存储键前缀（`src/helpers/` 内 `lihua_*` 前缀——user-setup/remember/token 等，grep 全量定位；**改前缀清除用户本地登录态/记忆，属预期，向用户说明**）。
- **全量**（加）：本仓无 Java 包名，此档对本仓无追加动作。

## 版本重置

- `package.json` version → 1.0.0。
- `src/manifest.json` versionName → 1.0.0、**versionCode → 100**（App 版本检查按 versionCode 数值比较，留百位空间；注意 HBuilderX 工具链会自动改写 manifest，提交前核对）。

## 裁剪承接（按驱动方裁剪清单执行对应项）

- **部门+岗位**：删向导默认部门步（`components/user-setup/UserSetupDefaultDept`）与 postLoginCheck 消费；**设置页修改默认部门**（`subpackages/system/setting/user/SaveDefaultDept` + `setting/user/index.vue` 入口）；`stores/user.ts` 部门状态；Profile 部门岗位展示；相关 api（profile/dept）。
- **通知公告**：删通知中心（subpackages/system/notice）、红点链路消费点、推送横幅资产。
- **组件演示页**：删 `subpackages/system` 内演示性质页面与仅被演示消费的样板引用（公共组件本体保留）。
- **监控**：本仓无感。
- 每项删除后跑 type-check + 残留 grep 审计；pages.json 增量登记同步清理（键名是驼峰 `subPackages`）。

## 验证与纪律

- 每步 `npm run type-check`；涉及页面/交互的裁剪，汇报时列真机人工回归点（AI 以静态检查为界）。
- 每步一 commit（用户项目历史从 init 开始），不 push；删除先列清单经确认。
- 改动波及 skills/ 内路径字样时同步更新 skill 文本（skill 是活文档）。
