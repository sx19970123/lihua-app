---
name: conditional-compilation
description: lihua-app（uni-app x）条件编译铁律：业务页面禁止 #ifdef，平台分叉必须收敛到组件/工具类。写页面代码与迁移改造时使用。
---

# 条件编译铁律（conditional-compilation）

**铁律原文（2026-11-14 用户拍板）**：除了极个别的全局配置，所有条件编译不能出现在主页面（业务页面 .uvue）。如需机型/平台分叉，自行封装组件、工具类，在组件/工具类端解决条件编译。

## 规则

1. **页面 .uvue（pages/ 下所有文件）里禁止出现 `#ifdef` / `#ifndef`**。grep 自查应为 0 命中。
2. **允许的例外（极个别全局配置）**：`pages.json`、`manifest.json` 等**构建配置文件**；`App.uvue` 中确无组件/工具类承载方案的全局生命周期分支（需在计划卡中说明理由并经用户确认）。
3. **平台分叉的两种落地形态**：
   - **工具类收敛**（首选，逻辑分叉）：域根 `.ts` 导出统一接口，内部分叉。旧工程先例 = attachment 域 `platform/{h5,app,mp}.ts` 域伴随文件架构（域入口 + 命名空间导入，#ifdef 收域入口）。uni-app x 一期 App-only 时保留接口形态，分叉点内部随用随建。
   - **组件封装**（视图分叉）：页面引统一组件名，组件文件内部收 `#ifdef`（如 iOS/Android 双实现各一文件 + 入口文件按平台引）。组件放 `components/<域>/` 下。
4. **迁移旧代码时**：旧工程页面里已存在的 `#ifdef`（如 request/haptic/键盘 composable）迁移时一并收敛进 utils/组件层，不顺手带进页面。
5. **验证纪律**：页面改造完成的自查项之一 = `grep -rn "#ifdef\|#ifndef" pages/` 为 0（豁免文件另行登记）。

## uni-app x 一期的已知分叉点（预登记，均按第 3 条收敛）

| 域 | 分叉 | 收敛位置 |
|---|---|---|
| 键盘 | iOS/Android 键盘高度行为差异 | utils/keyboard（工具类） |
| POW | webview vs UTS 插件通道 | pow/ 域内部（页面只调统一 API） |
| 检查更新 | apk 安装 / iOS 外链 | helpers/app-update（工具类） |
| 返回退出 | Android onLastPageBackPress | App.uvue（属例外 2，全局生命周期） |
| 触感 | vibrate 参数差异 | utils/haptic |
