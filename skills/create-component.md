---
name: create-component
description: 指导 lihua-app（uni-app x 蒸汽版）新建或修改公共组件（components/app-* 族）。适用于手搓组件的完整规范：官方优先三档、sard 源码参考、x 端样式铁律（单类选择器/rpx 归零/token 体系/行高 padding 直构禁 min-height）、暗色模式、按压反馈四等级（press.scss）、theme store 亮暗感知、动画瞬态化与后台恢复防御、元素常驻与烘焙字段、触区规范。跨端坑点详规见 cross-platform-pitfalls.md。
---

# 新建/修改公共组件（uni-app x 手搓组件规范）

uni-app x 没有可用组件库（sard 是 uni-app 版不可用），公共组件全部手搓。本仓组件以
sard-uniapp 为视觉/交互基准（源码参考：`npm pack sard-uniapp` 解包读 `components/<名>/`），
在 x 端平台限制下重写。新建或改动 `components/app-*` 组件时逐节核对。

## 前置流程（落笔前必做）

1. **官方优先三档**：① x 内置组件（button/checkbox/loading…）改 css 能用则直接用；
   ② uni-ui x 官方扩展（uni_modules，如 uni-icons-x、uni-badge-view）覆盖则导入用；
   ③ 都没有才手搓。已定案：弹窗=uni.showModal（不封装）、badge=uni-badge-view（ext 27844）。
2. **读 sard 源码再落笔**，别凭文档脑补样式（app-tree 复刻走弯路的教训）。
3. 通用组件不带业务名（app-steps 非 setup-track），进 `app-*` 族；业务组件进业务域目录。

## 样式铁律（x 端限制，全部实证）

- **选择器仅单类**：后代/嵌套/`.a.b` 连写全不生效；BEM 扁平单类命名。
- 无伪类（:first-child/:not）、无伪元素（::before）——分隔线用独立 1px view，首末行
  特殊化用烘焙字段。
- **rpx 归零**，全 px（官方推荐；rpx 仅随屏宽的 width 合法，本项目无此场景）。
- 颜色/字号/圆角/间距走 `styles/tokens.scss`：圆角三档 `--lh-radius`(12)/`-sm`(4)/
  `-full`(9999)；字号 xs10~2xl32；列表行主文字用 `--lh-text-lg`(16) 对齐 iOS/微信规格。
- **text 样式不继承**：每段 text 显式 color/font-size/line-height（行高用 leading 比例
  token，固定 px 行高+token 字号混用会裁字）。
- 横向 flex 布局必须显式 `flex-direction: row`——**uvue view 默认 column**，
  justify-content 管的是竖轴（水平偏移踩坑实录）。
- `overflow` 默认 hidden（W3C 才是 visible）；子元素越盒渲染需显式 `overflow: visible`
  （view 全端支持）。
- `:hover-stay-time` 等为原生属性族（stay 默认 400ms 太长，统一 100）。
- scroll-view 的 css padding 不生效；其滚动方向新规范为 `direction`（默认 vertical），
  scroll-y 已废弃。
- **行高定高=padding 直构**（跨端统一账，详规见 cross-platform-pitfalls.md）：行高
  =上下 padding×2+文字行高，**禁用 min-height 抬行**——App 端引擎按 content 区计
  （min+padding 叠加）、MP 按 border-box，同一声明两种高度（2026-11-22 诊断卡实锤）；
  图形列（icon/arrow）容器钉 `height: 22px + overflow: visible`，防 uni-icons 默认
  行盒撑高；tree 式 max-height 钳制法（内容自然高+max 单属性）为同哲学替代。
- 条件编译铁律：业务页面禁 #ifdef；平台分叉收敛在工具类/组件内。

## 暗色模式

- 组件内**零硬编码色**、不写 @media 双段——全走 token（亮暗自动）。
- 仅两类例外：①精调组件双值场景（如验证码红绿结果色）组件内 @media 双段；
  ②**hover 按压类必须字面量**（见下节）。

## 按压反馈与分隔线（styles/press.scss 统一维护）

- 机制：`hover-class` 原生驱动 + `:hover-stay-time="100"`；选类依据
  `stores/theme.ts` 的 `themeStore.isDark`。
- 按压四等级（组件 style 头 `@import '@/styles/press.scss'`，编译期合并进作用域）：
  行级 `.app-pressed-row(-dark)`、卡片级 `.app-pressed-block(-dark)`、
  灰底内嵌级 `.app-pressed-inset(-dark)`（secondary-bg 灰底载体：分段器段等——
  row/block 在该底色上各有一半场景同色不可见）、
  文本级 `.app-pressed-text`（opacity .5，跨亮暗免双类）。
- **hover 类不能走 var/@media**（原生驱动不重算，主题切换停旧色）——必须字面量双类。
- **滑动/滚动自动抑制按压（组件自治，勿用 props/页面状态广播）**：组件自绑
  `@touchstart`/`@touchmove` 测位移，>5px（与侧滑方向判定同阈值）即滑动——横滑、
  纵滚统一判定；`:class` 叠加 `app-pressed-none` 透明类盖按压底色（press.scss 末位=
  同特异性压制在前的按压类）；复位在下次 touchstart（盖满 stay-time 余韵防闪回，
  类滞留无视觉差=透明即未按压常态）。hover-class 值全程恒定铁律不变（坑⑥）。
- **线色强制=按压色（全组件统一，用户拍板 2026-11-21）**：带分隔线的载体，线色直接挂
  同名按压类 `app-pressed-row`（行级载体）/`app-pressed-block`（卡片级载体）——常驻渲染
  走类的 @media 暗色段自动亮暗，与按压色同一定义（按压时线画在灰上同色隐形，物理上
  不可能不同色）；线自身类只管几何（position/端点/高度），双类叠加。
  **组件禁止自定线色**；调按压色/线色只改 press.scss 一个文件。

## 动画

- transform/opacity 过渡可靠；**height 与 max-height 的 transition 在 Vapor 全灭**
  （Web/微信生效）。
- keyframes 宽高动画可行（5.31+）但**只支持固定值**（动态目标高度做不了，改 JS 显式
  计算高度）。
- **动画瞬态化**：稳态不挂 animation（后台切换系统重置渲染层动画，常驻动画被打回起始帧
  撑空白，触摸才复原）——用前后状态快照判定「刚变化」挂变体类，下次烘焙切回静态类。
- 容器高度显式静态可算（不靠内容自然撑——测量链在后台恢复会陈旧）。
- v-if 无法过渡→常驻+opacity/pointer-events；同 class 复挂 animation 不重触发→双 class
  交替或 :key 重建。

## 结构与响应性

- **元素常驻零销毁**：批量行销毁触发框架 Element::Dispose 崩溃（SIGSEGV）——显隐走
  class（max-height/opacity）或 v-show，禁 v-if 批量切换。
- **烘焙字段+纯属性读**：class/显隐逻辑在 watchEffect 里写进 state 字段，模板只读属性；
  `:class="fn()"` 函数调用形态不追踪依赖（死路）。
- import 统一写 script 顶部。

## 平台分叉组件（多端策略五级阶梯——自上而下尝试，降级须拍板）

依赖元素命令式能力（`el.style.setProperty` / `el.getBoundingClientRect`）的组件在 MP 端
垫片缺失（v-for 元素 ref 无 .style、无量测函数）。遇到平台分歧按阶梯**自上而下**尝试，
每降一级都是维护成本的取舍，**落哪级须在组件头注释标明级位与原因**：

1. **天然多端兼容（最优）**：选天然全端可用的实现——响应式 :style/烘焙 class/token/
   computed 派生（app-card/list-item 形态）。设计期优先往这级靠。
2. **多端兼容且不伤体验的替代实现**：换全端受支持且 UX 无损的机制（如逐帧 setProperty
   直驱改全端响应式 :style——各端帧率观感可接受时；量测改全端字符估算）。降级条件=
   兼容做法在某端有可感知体验损失。
3. **组件内零星条件编译**：单文件，只在个别分歧点 #ifdef（写层适配器/单条 API 分支），
   模板不分叉（属性级 #ifdef 不存在，模板分叉=升成本）。
4. **核心组件分叉**：状态机抽共享模块（engine.ts）单源，仅模板+写层壳按平台分文件；
   薄入口条件 import 选核心（见下「薄入口形态」）。
5. **完全分叉（最下策）**：按平台独立完整实现（状态机也双份）——仅当交互模型被迫
   根本分歧（如 MP setData 撑不起逐帧跟手、须换 CSS transition 开合模型）；须用户
   明确拍板 + 双核文件头标「改动须双侧同步」纪律，双平台绿后尽快抽 engine 降回第 4 级。

先例：app-swipe-action 现处第 5 级（临时——iOS 已验优先保 app，engine 抽取后降第 4 级）。

**薄入口形态**（第 4/5 级共用）：
- 入口 `app-*.uvue`：**script 条件 import** 选核心（`#ifdef MP-WEIXIN` 等），模板单份
  `<Core>`+透传 props/events/slot/expose 代理——模板不做 #ifdef。
- `core/` 核心按后端矩阵开份数：app(iOS/Android/鸿蒙)/H5 元素 API 同构**一份通吃**；
  新平台真机冒分歧再拆（入口加一行条件 import），不预写份数。
- 共享模块是内部实现非契约，平台交互模型被迫分歧时该平台核心可自治。
- 平台差异代码收敛在组件/核心内，业务页面零 #ifdef（铁律不变）。

- MP 量测兜底（各级通用）：`try el.getBoundingClientRect()` 抛错/零宽 → 字符宽估算
  （CJK≈1em、其余≈0.55em × 字号），纯中文误差 ±2px。

## 交互

- 触区意识：可点元素热区 ≥32（理想 44）；**热区可大于视觉**（icon 居中留缓冲）。
- 相邻按钮热区紧贴零死区（系统 toolbar 同款），视觉间距用盒内非对称偏移收窄。

## 收尾自查

- 标签配对校验（模板改动必做）；pages/ 零 #ifdef；注释简洁（一两行说用途，设计推理
  放 commit/记忆不塞代码）。
- 新组件在 `pages/component/` 建独立 demo 页（@import `styles/demo.scss`），并在
  `pages/component/menu.uvue` 对应分组登记。
