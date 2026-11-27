# uni-app x 学习笔记（随迁移轮滚动追加）

> 配套 lihua-app → uni-app x 蒸汽模式迁移。每轮记「做了什么 + 为什么 + 心智模型」，可当迁移日志读。

## 第 1 篇 · 基座接线与三个编译流（2026-11-14）

### 本轮做了什么

- 核对骨架 vapor 配置（manifest `uni-app-x` 节点）、补建 `uniapp` 封存分支、建对照 worktree `../lihua-app-uniapp`
- 接线 S1 基座：`package.json`（pinia 3.0.4 + vue 3.5.45 + vite 5.2.8）、`vite.config.js`、`.env.development/.env.production`、`utils/env.ts`、`main.ts` 接 pinia、`stores/counter.ts`、尖峰验证页 `pages/index/index.uvue`（V1 Pinia / V2 环境变量）

### 心智模型：一个 .uvue 文件被拆成三股编译流

uni-app（旧版）的页面编译后还是「网页那一套」：DOM + CSS + JS。uni-app x 蒸汽模式把一个 `.uvue` 拆成三股：

| 源码 | 编译产物 | 类比 |
|---|---|---|
| `<template>` | 原生渲染指令（View 树直驱，无虚拟 DOM） | 类似 SwiftUI 的 ViewBuilder |
| `<style>` | ucss → C 代码/字节码，进原生布局系统 | 类似原生 LayoutParams |
| `<script lang="ts">` | ts→js，跑标准 JS 逻辑层 | 这股和 web 前端没差别 |

**这就是「逻辑层跑 JS，免 UTS 改造」的含义**：业务 TS 代码（我们的 request/stores/api）原样编译成 JS；只有模板和样式吃原生编译的红利（快 2-3 倍那部分）。UTS 只在写原生插件（utssdk）时才需要。

推论：**npm 生态可用**——pinia/dayjs/lodash-es 这类纯 TS 库都走第三股流，这是 V1 尖峰要验证的事（官方教程里「pinia 不支持」的说法针对 UTS 编译态，js 驱动下不适用）。

### 蒸汽模式的「作文扣分项」（本轮用到的）

1. **文字必须包 `<text>`，样式不继承**——web 思维里父节点设 color 子节点自动继承，蒸汽里 `<view class="card">` 里的裸文字不会吃到任何样式。所有文字样式写在 `<text>` 自己的 class 上（尖峰页的 .label/.value 都是这么写的）。
2. **仅简单 class 选择器**（BEM 单类名）——`.card .label` 后代选择器、`#id`、伪元素都不可用。样式全写单类，代价是类名变多。
3. **仅组合式 API**——`<script setup>` + ref/computed，选项式 API 和 mixin 直接废。我们旧工程本来就是组合式，零迁移成本。
4. **vue API 自动引入的适用边界**——官方文档承诺范围是 .uvue 页面/组件的组合式 API（「不需要 import ref/computed/watch/onLoad 等，uni-app x 会自动引入」，docs/vue/README.md）。纯 .ts 文件：hello 官方 store/index.ts 的 `reactive` 无 import 能编译过（行为实证），但无文档承诺，且 IDE 类型层（vue-global 只全局化组件事件类型）大概率报红。**约定：.uvue 里不 import（跟官方提示词）；.ts 里显式 `import { ref } from 'vue'`**（counter.ts 已按此修正）。

### 环境变量：官方定论 = 不支持自定义变量，constants 是推荐形态（2026-11-14 终案）

**官方明文**（worktile/running-env.md）：「uni-app x 不支持自定义环境变量」。唯一支持 `process.env.NODE_ENV` 两态（HBuilderX 运行=development / 发行=production），文档示例用法就是「连接测试服务器或生产服务器的动态切换」，且 NODE_ENV 死分支**编译期摇树移除**。

**实测轨迹（教学价值，三步全记录）**：
1. 初案 `.env` + vite.config.js（loadEnv+define）→ **编译报错案例 001**：.uvue 原始源码进 import-analysis=插件链脱钩，根因=vite.config.js 存在本身（HBuilderX 工程形态下走不同管线；官方 loadEnv 示例出自共享文档/CLI 工程）。改名 `.off` 退出编译链后恢复
2. 隔离实验真机判读：pinia ✓ / NODE_ENV ✓（原生注入实锤）/ VITE_APP_* 空（.env 自定义变量官方不注入——设计如此非 bug）
3. 终案 **constants**：`utils/env.ts` 内 dev/prod 两组常量 + 逐项 `process.env.NODE_ENV === 'development'` 三元（逐项重复而非引 IS_DEV，让每处三元都是编译器本地可折叠表达式，摇树更彻底）；`.env×2`/`vite.config.js.off` 已删，vite devDependency 已卸载

**代价**：dev 局域网 IP 入库，二开交付改 env.ts 顶部四行常量。将来三态（测试环境）= 加一组常量+一个判断，结构不动。

**原则沉淀**：官方文档里跨产品共享的内容（docs-common）会把 uni-app 的能力描述带进 uni-app x 目录——「HBuilderX 中可用」字样必须对照产品线甄别，**实测是唯一裁决**。

### 验证工具链认知（分层验证纪律）

- `cli lsp lint`（语法检查）：**蒸汽项目明确不可用**（金矿 skill 声明 vapor 模式跳过）
- `cli launch app-android --project X --compile true`：编译层验证，需 HBuilderX 主程序运行（cli 只是伴生进程）
- 真机/基座运行：HBuilderX 里运行到 Android 基座，看首屏 + 点按钮
- 纪律口径：语法过 ≠ 编译过 ≠ 运行过 ≠ 业务验收过；结果只说「未执行/通过/失败/阻塞」

### 待验证（本轮交付的开放项）

- [x] V1：pinia 计数器真机点击 +1 —— **2026-11-14 iOS 基座通过（npm 生态在蒸汽编译链可用）**
- [x] V2：BASE_API/NODE_ENV —— **2026-11-14 iOS 基座通过（constants 终案）**
- [x] 编译流确认：iOS 基座编译通过（报错案例 001 定案后）

### 编译报错案例 001：vite.config.js 与 .uvue 插件链（2026-11-14，已定案）

**现象**：`vite:build-import-analysis` 报 App.uvue「invalid JS syntax」——import-analysis 拿到**原始 .uvue 源码**（连 `</script>` 标签都在）=.uvue 编译插件脱钩插件链，仅 3 modules transformed。

**定案**：根因 = vite.config.js 存在本身（函数式 + loadEnv 写法，HBuilderX 工程形态下破坏内置插件组装）。改名 `.off`（精确文件名匹配退出配置候选名单）后编译恢复——单一变量隔离实验实锤。**教训：HBuilderX 工程的 vite.config.js 行为未实证前，新增它本身是风险**；uni-app x 官方也不需要它（环境变量终案=constants，见上节）。文件已删。

### 项目铁律：条件编译不进页面

用户拍板（2026-11-14）：业务页面 .uvue 禁止 `#ifdef`，平台分叉收敛到工具类（首选，逻辑分叉）/组件封装（视图分叉）；豁免仅限 pages.json/manifest 等构建配置 + 经确认的 App.uvue 全局生命周期。已写入 [skills/conditional-compilation.md](../skills/conditional-compilation.md)。这与旧工程 attachment 域 `platform/{h5,app,mp}.ts` 的域伴随文件架构一脉相承。

## 第 2 篇 · request 层：拦截器 → 显式分流（2026-11-14）

### 本轮做了什么

request 层落地（用户拍板顺序调整：基础设施先行，登录页推后）：`utils/request.ts` 重写（sard Request 类 → uni.request）+ 四个零依赖文件直迁（api/global/type.ts、helpers/token.ts、utils/client.ts、utils/toast.ts）。

### 心智模型：拦截器的「隐式」变「显式」

sard 的 `Request` 类用拦截器链（request.use / response.use）做横切处理；uni.request 是裸 API 没有拦截器。等价改造 = 把拦截器逻辑变成**显式函数**：

```
请求拦截器（加头）  → buildHeader()：Client-Type/Authorization/Content-Type 组装
响应拦截器（分流）  → handleResponse()：401/403/451/505/statusCode 逐段判定，resolve 或 reject
错误回调           → fail 里直接 reject(new ResponseError(500, err.errMsg))
```

好处是控制流一眼看穿（不再是隐式链）；api 层调用形态 `request<T>({url, method, data})` 保持不变，**29 个接口文件将来零改动直迁**（已实证：旧 api 层 url 全部无前导斜杠，BASE_API + '/' + url 拼接安全）。

### uni.uploadFile 的坑：响应是字符串

`sard Request.upload` 返回已解析对象；**`uni.uploadFile` 的 success 回调里 `res.data` 是 string**——必须手动 `JSON.parse(res.data)`。后端返回 JSON 时这是必踩点，request.ts 里已处理（try/catch 包解析）。

### 结构与依赖决策记录（用户定稿）

- **文件结构对齐拦截器心智**（用户蓝图）：`before`（前置，组装通用头）→ `after`（后置，业务码分流）→ `toErrorPage`（工具方法）→ `request`（显式调 before+after）→ `attachmentUpload`（显式调 before+after）——比拦截器链更直白，与 web/uniapp 端结构可对照理解
- **Content-Type 分工**：before 只组装通用认证头；JSON 头由 request 自己加，upload 不加（multipart 由原生组装，手动指定丢 boundary）——旧拦截器「method !== 'UPLOAD'」判断在新结构下天然消失
- **content-type 不外露为 config 配置项**（设计定稿）：它和 body 编码强耦合（uni.request 对 object 默认 JSON.stringify，改 form 头不会自动改编码——头与编码不一致必错）。正交维度是「传输形态」：request=JSON、attachmentUpload=multipart、将来 form-urlencoded 新增 formRequest（头+编码+超时封装一体，仍复用 before/after）。两端实证：业务 api 全 JSON、multipart 仅附件域、urlencoded 零使用——形态天然 3-4 类封顶，与 web 端 request/blobRequest 分形态同思路
- **401 分支不留临时实现**（用户口径「需要后补的不要提前写」）：当前真实行为=仅 toast+reject；登录失效跳转（清 token/userInfo+断 WS+回登录页，含登录页豁免判断）等 user store 迁移后在原分支补
- client.ts 恢复条件编译三分支（APP/MP-WEIXIN/WEB，H5→WEB 是 uni-app x 平台标记变化）——用户纠偏：按平台返回的函数其固有语义就是分叉，单分支也是一种「等 S6 后补」的临时实现，违背「不提前写」。连带 tsconfig 加 `allowUnreachableCode: true`（条件编译工程标配，否则三个 return 在 TS 语言服务里报 unreachable）
- toErrorPage 保留完整实现（pages/error/Error 未注册时 reLaunch fail → console.error 兜底；尖峰阶段无受保护页面，分支到不了）

### 注释纪律（用户两次提醒后的执行标准）

**一两行说用途+关键参数即上限**（如 `DEV_API 开发环境后台地址`）；设计推理链、决策记录放本笔记或 commit message，不塞代码。旧版 request.ts 里的多行语义注释迁移时一律压缩成单行核心语义。

## 第 3 篇 · attachment 域整迁 + user store 接线（2026-11-14）

### 本轮做了什么

attachment 域整迁提前（S4-06，6 文件+crypto-js）→ user store 轮（12 文件直迁+request 层 401 接线）。顺序由用户两轮拍板：域先成域，store 再消费。

### uni-app x API 认知更新

- **x 端无全局 `uni.getFileInfo`**：正规姿势 `uni.getFileSystemManager().getFileInfo()`（iOS 4.11+/微信 4.41+；返回字段 size/digest 与旧全局 API 同形，digest 默认 md5）。**fsm 的 Web 平台未支持** → web.ts 保持 fetch/Blob + crypto-js 方案
- `uni.downloadFile` 双端可用（iOS 4.11+/Android 3.91+）；`getCurrentPages()` iOS 4.11+ 可用，`page.route` 字符串比较是官方示例同款用法（401 登录页豁免依赖它）
- 平台标记三连改：`APP-PLUS`→`APP`、`H5`→`WEB`、`#ifndef APP-PLUS || H5`→`#ifndef APP || WEB`；platform/ 伴随文件命名 h5.ts→web.ts 随标记走

### 设计决策记录（用户拍板）

- **multipart Content-Type 策略收进 attachmentUpload**：旧设计经 header 参数外露给调用方是 3.0 content-type 定稿的不彻底处（JSON 头自加/multipart 头却让调用方传，不对称）。现在 request=JSON 自加、attachmentUpload=多 part 自定，对称；App/小程序保留手动 `'multipart/form-data'` 声明（旧实证形态，原生补 boundary，未赌「不传自动组」），WEB 不设（浏览器自动生成含 boundary 的头）。platform 层不再定义上传头（唯一消费者=storage.upload，grep 实证后删）
- **域入口三个 namespace import 包进 #ifdef**：x ts2js 流树摇行为不确定，未用平台文件及其依赖（crypto-js）不进对应端包；域内 #ifdef 符合铁律（工具类合法驻地）
- **request↔store 循环依赖**：旧 sard 时代同款形态（两边仅函数体内惰性调用）已实证可用；pinia 在 main.ts 先于一切请求安装
- **两处标记行纪律**（同 401 先例）：authenticationFailure 里 `webSocket.closeConnect()` 留注释待 WS 轮补；`reLaunch('/pages/login/Login')` 保留原样等 ③ 注册路由生效（本轮不可达，尖峰页无 API 调用）

## 第 4 篇 · 登录页：手动键盘 hack 退役与蒸汽化样式（2026-11-14）

### 本轮做了什么

③登录页完整接线版（A 切面）：Login.uvue（蒸汽化+login api/remember/postLoginCheck/setting store 全接线）+ 基础件 app-input/app-button/app-dialog + tokens.scss/auth.scss + pages.json 注册 + 直迁 5 文件（crypto/remember/user-setup/setting api+store）。

### 核心认知：uniapp 的键盘 hack 为何整体退役

uniapp 时代键盘弹起会**缩小 webview**，fixed 元素（协议行/协议弹窗）错位，才有了手动补丁：adjust-position=false+translateY(-30%) 表单上移、caret-color transparent+延迟淡入、page{position:fixed} 滚动锁、键盘 composable（uni.onKeyboardHeightChange）驱动显隐。x 是原生渲染、键盘覆盖不推挤布局——**这批补丁全部失效化**，按用户拍板删除：input adjust-position 走默认原生上推、光标原生默认、协议行常驻底部（键盘直接盖住）。composable 整个退役后，连 x 端 onKeyboardHeightChange 的 id 制改写（on 返回 number id、offKeyboardHeightChange(id?) 收 id，iOS 4.71+）都用不上了。

### ucss 能力边界（本轮实证）

- **无 gap 属性、无伪类**（:not/:nth-child）→ app-space 无法实现子项间距，登录页布局直接 view+flex+margin 摊平；**无伪元素** → 旧 iconfont 的 `.icon-xxx:before{content}` 形态不可用
- **图标路线改 uni-icons-x**（官方 uni_modules 扩展组件，插件市场 30221，非 npm）：内部只渲染一个 text 根节点，type 字符串联合类型 IDE 全量提示；图标名映射 UserOutlined→person、LockOutlined→locked
- **样式隔离 2.0 明文**：单根组件的外部 class/style 落组件根节点（根样式传递不受隔离影响）；页面类打不进组件内部；css var 靠继承可达组件内部（继承≠class 命中，隔离不影响）→ tokens.scss 在 App.uvue 全局 style 定义 page 级变量，组件内直接引用
- **x view 默认 flex-direction: column**（与 web div 相反），row 必须显式写

### 决策记录（用户拍板）

- tokens.scss 项目单独维护（--lh- 前缀避 --sar 命名空间），值源 sard 主题页（guide/theme）+npm 包 configuration.scss；不照抄全量，页面迁移按需增补。取值坑：tertiary-color 亮色=gray-600 #74787c（npm 源码 grep 出亮暗两个值没分归属，主题页核对才定）
- H5 样式分支保留（#ifdef WEB + min(20vh,40%)），S6 WEB 端实测后再定去留——条件编译只在 WEB 构建生效，App ucss 不解析该分支
- checkbox 用内置组件受控模式（:checked + @tap 翻转，无 change 依赖）；app-dialog 最小版=组件式 v-model:visible+confirm/cancel（sard 函数式调用场景 S2-01 再加 Promise API）
- .uvue 里 useSlots/InputEvent 等走官方自动引入/全局类型（IDEA 可能报红=已知残留类别）
- 向导分支暂落点：postLoginCheck 有待补全项时暂存+回首页+提示（向导页 S2-11、守卫拉回 S2-03）

### 补记：组件「官方优先三档」原则（用户 review 拍板）

用户修正：倾向官方提供的能力，实在没提供的再手搓。落成三档：
1. **内置组件直接用 + class 调样式**：登录按钮删手搓 app-button，换内置 `<button type="primary" :loading>`——原生自带 loading 转圈（Android Vapor 5.21+/iOS Vapor 5.11+）、disabled、hover-class 点击态，比手搓 opacity 方案强；内置组件页面 class 直达无隔离问题；button 内裸文字合法（官方示例同款）
2. **官方 uni_modules 扩展组件**：uni-icons-x（图标）；**app-dialog 重写为 page-container 基座**——官方内置弹层组件（iOS/Android 5.02+，position=center、自带遮罩/过渡动画/@clickoverlay），**还白赚返回拦截**（右滑手势/物理键/navigateBack 关弹层不关页面，手搓 fixed 版做不到）；组件跨端，dialogPage 不支持小程序且须 pages.json 注册独立页面（协议弹窗强耦合登录页状态，组件式更合适）
3. **薄壳封装判据**（用户口径）：只需调 props→直接用内置；**大范围调整 css 或缺功能→封装组件**。app-input 评估=背景/高度/圆角/padding 四项 css 大改+前置图标/聚焦清除两项缺失→薄壳成立（内核=内置 input）

终态：手搓组件 0 个——app-input/app-dialog 都是官方组件的薄壳。

### 补记 2：npm 包准入铁律——x 打包器只吃 ESM（首次编译实战）

crypto-js 引出三连死，全在 uts 打包器对**纯 CJS 包零互操作**：
1. `import CryptoJS from 'crypto-js'` → 编译错 `"default" is not exported`（CJS 无 default 导出，打包器不包装）
2. 改 `import * as CryptoJS` → 9 条编译警告 `"enc/AES/mode/pad" is not exported`（打包器把 `CryptoJS.AES` 属性访问当 ESM 具名导出解析，全 undefined），且**编译仍"成功"**——死在运行时：crypto-js 的 UMD 头走 global 探测分支，x 运行时 this=undefined → `TypeError: root.CryptoJS`
3. pinia 能过是因为它自带 ESM 构建——**选 npm 包先看 package.json 的 module 字段有无 ESM 入口**

解法：换 **crypto-es**（crypto-js 的 ESM 同源移植 v3.1.3）。注意**导出形态不同构**：扁平具名导出（AES/Utf8/CBC/Pkcs7/MD5/WordArray），没有 CryptoJS 聚合对象——具名导入重写，本地 node 双验证（round-trip 含中文 PASS + md5 对拍标准值 PASS）后才上真机。教训：npm 依赖进 x 工程，先本地验导出形态+回环，再上编译。

### 补记 3：tokens.scss 全量化（用户拍板推翻「按需增补」）

用户定调：sard 的 css 变量全量拉进项目，组件开发时暗色/圆角等全系统统一。落地：

- **值源管线**：npm pack sard-uniapp → `npx sass` 编译 variables.scss/variables-dark.scss 得**字面量**（color.scale 等编译期函数被展开，如 primary-text=rgb(23.1%,43.6%,77.2%)）→ python 转换器生成 --lh-* 前缀 tokens.scss（145 亮色+42 暗色覆盖项）
- **token 引 token 全部内联为字面量**：sard 语义变量（--sar-primary: var(--sar-blue) 等几十处）在 x 不可用（「值不可嵌套 var」限制），转换脚本递归展开
- **暗色机制与 sard 同构**：x 蒸汽 5.25+ 支持 `@media (prefers-color-scheme: dark)`（本机 5.34 ✓），tokens.scss 双段 page 块（亮色默认+dark 覆盖）；基础色/灰度/字号/圆角不随暗色变，语义场景色（body/secondary/tertiary/fourth/emphasis/border/active/shadow/mask/disabled）暗色全覆盖
- **命名回归 sard 原名**：早期自创 --lh-primary-color 别名废除→--lh-primary（app-dialog/auth.scss/app-input 三处消费方同步改）；--lh-button-height 进「项目补充段」（组件级不入全量段）
- **分层**：全局 theme 变量全量进 tokens.scss；组件级变量（--lh-input-*）随组件自管
- **app-input 引用全局化**：border→--lh-border-color、radius→--lh-rounded、duration→--lh-duration（暗色/主题调整自动生效）；placeholder-style 属性串保持字面量（var 在原生样式串不赌，暗色 placeholder 登记 P1）
- 坑记录：转换脚本首版 name[5:] 少切一位产生 --lh-- 双横杠、dark 段 var(--sar-*) 引用未替换——两处都在自查（grep lh-- / grep ": var(--lh"）中抓出重跑

### 补记 4：全局亮暗自动跟随系统（用户拍板：先全局自动，组件适配后调）

三处配置：
1. **manifest.json `app.defaultAppTheme: "auto"`**——App 平台主题开关在此（`darkmode` 节点是 web/小程序用的，App 不用）；取值 light/dark/**auto**（Android/iOS 4.18+）。auto=跟随系统；css `@media(prefers-color-scheme)` **自动跟随 appTheme 匹配**（官方明文），tokens.scss 双段无需额外 JS
2. **theme.json**（根目录自动识别，无需 themeLocation 注册；4.18+）——只管 pages.json 的原生样式（防转场闪白/黑）：navBgColor/navTxtStyle/bgColor 三变量，亮暗双值（bgColor 对齐 tokens 的 body-bg：亮 gray-100 #F7F7F8/暗 #000）
3. **pages.json globalStyle** 改 @ 变量引用：navigationBarTextStyle（**custom 导航页的状态栏文字色也由它管**）/navigationBarBackgroundColor/backgroundColor

分层心智：theme.json=pages.json 原生层（转场瞬间）、css media=tokens 组件层（渲染后）。后续用户级主题切换（S3-08 设置页 light/dark/auto 三态）走 uni.setAppTheme，媒体查询自动跟着变。

### 补记 5：app-input 暗色适配（用户点名轮，配色参考 sard dark）

- **暗色 surface 色板**：卡片面亮白/暗=sar gray-900 **#242628**（sard dark emphasis-bg，黑底上的"抬升面"），input 根壳与 dialog 卡片同规则
- **组件内 media 块可用**：`@media (prefers-color-scheme: dark)` 直接写进 .uvue 组件 style（蒸汽 5.25+），配组件级 token fallback（--lh-input-bg/--lh-dialog-bg）供主题覆盖
- **页面背景兜底**：auth.scss `page{background-color: var(--lh-body-bg)}`（tokens 亮 gray-100/暗 black，与 theme.json bgColor 同值双保险——不赌 page view 层默认背景行为）
- **图标色去硬编码**：uni-icons 外部 class 落根（隔离 2.0 明文）→ clear=tertiary（亮 #74787c/暗 #b5b9bd）、eye=fourth（亮 #b5b9bd/暗 #74787c）、prepend=tertiary，全走语义 token 暗色自动；内联 style 色会压过 class 色故必须去掉
- **control 文字色本就自适应**（--lh-emphasis-color 亮 #000/暗 #fff）
- **placeholder 保持 #b5b9bd 固定**：placeholder-style 属性串不赌 var 支持；亮暗底均可读，暗色精确适配需 JS 读 appTheme 动态换串——P1

### 补记 6：app-input 通用化扩展（用户清单轮：形状/尺寸/只读禁用/maxlength/count）

| prop | 实现 | 关键事实 |
|---|---|---|
| shape: default\|round | round→border-radius 9999rpx（根类绑定） | — |
| size: small\|default\|large | sm→padding-y 6rpx；lg→control 字号 32rpx | 后代选择器不赌，control 独立绑类 |
| disabled | **透传内置 input（原生 iOS 4.11+ ✓）**+置灰面/文字（--lh-disabled-* token 暗色自适应）+tool 隐藏 | 原生支持 |
| readonly | **pointer-events: none**（x 内置 input 无 readonly，css 原生支持 iOS 4.11+）；点不进、不弹键盘 | sard 同款姿势 |
| maxlength | 透传内置（原生 ✓，-1 不限） | 原生支持 |
| showCount | 右侧 n/max（maxlength>0 生效），sard e(count) 简化同行版 | — |

tool 显隐规则：clear 在 disabled/readonly 下隐藏；eye 在 disabled 下隐藏、readonly 保留（查看明文无害）。control 的 disabled/readonly/lg 态全部独立绑类（根→子穿透不赌）。**透传形态=组件声明同名 props 显式转发（:disabled/:maxlength），非 $attrs 魔法**。

### 补记 7：背景归 pages.json（backgroundColorContent）+ 间距刻度体系（用户两问驱动）

用户质疑：背景统一管理不该住 auth.scss；全局间隙统一还是页面为准？查证+定案：

- **x 的 pages.json 背景属性语义陷阱**：`backgroundColor`=**只管下拉刷新露出的窗口**（无下拉刷新时无效果！蒸汽 5.25+ 才支持）——uniapp 时代的认知在此失效；**`backgroundColorContent`=页面容器背景色**（Android 4.0+/iOS 4.11+ 全端）才是页面视觉背景的正解。此前 @bgColor 绑在 backgroundColor 上=绑错属性，已改绑 backgroundColorContent
- **单一事实源**：页面背景=pages.json（theme.json @bgColor，亮 gray-100/暗 black）——css page 兜底（auth.scss/App.uvue）删除；转场闪白/黑+渲染层全覆盖。特殊页面=页面级覆盖
- **间距=「全局管刻度，页面管组合」**：tokens 项目补充段新增 7 档（xs 8/sm 16/md 24/lg 32/xl 40/2xl 48/3xl 64，从现有代码反推）；auth.scss 裸值全改引 token（20rpx→sm 16 取最近刻度）；特殊页面=刻度组合自由+页面级覆盖，刻度不够=评审新增，禁回头写裸数
- auth-item 的 90rpx/24rpx 保留字面量（尺寸非间距范畴）；margin-top 40% 保留（布局百分比）
- 组件内部微调值（8/10/12rpx 级）本轮未 token 化——统一推进时再收，避免过度工程

### 补记 8：圆角三档制（用户两问收敛：全站统一+小圆角组件存在性）

用户问全站圆角统一+五档意义。结论：**小组件天生小圆角确实存在**（圆角≈高度 20-30% 视觉最自然；高度 20px 的 tag 用 12px 圆角=60% 近胶囊显鼓），对应后续迁移的 dict-tag(S4-08)/badge(S2-01)/缩略图(S3-04)——但五档是组件库视角（几十组件各有比例），应用视角三档够：

- **--lh-radius: 12px**（主：卡片/按钮/input/dialog）+ **--lh-radius-sm: 4px**（小：tag/badge/缩略图）+ **--lh-radius-full: 9999px**（胶囊固定不参与主题）
- 删 sard 五档刻度（rounded-xs..xl/full）——留着=第二套体系早晚误用（某处 --lh-rounded-sm 不跟全局）
- 消费方 6 处改引（input 根/round、dialog 卡/按钮、auth-item、auth-btn），残留硬编码 grep=0；统一值 12px=auth 真机已确认观感（app-input 默认 6px 随之拉齐）

### 补记 9：间距档位用途注释（用户问屏幕边距/卡片间隔惯例）

七档各挂用途：lg 16px=屏幕两侧边距/卡片内边距/标准区块间隔（Material 16dp/HIG 16-20pt 惯例）、md 12px=紧凑卡片间隔；auth 页 padding 24px(2xl)=特殊居中布局页的页面级覆盖实例，与「常规列表页边距=lg」不冲突。

### 补记 10：全局工具类层启动（用户提议，第三块拼图）

样式三层补全：tokens=值域、页面 scss=专属布局、**common.scss=跨页面高频组合工具类**（App.uvue 全局引入，页面可引用全局 class=隔离 2.0 明文）。克制原则：出现一个抽一个，不做 atomic 全集（类名爆炸违背 token 纪律）。首个成员 .page-padding（padding: 0 var(--lh-gap-lg)）。auth-body 边距按用户拍板收窄 24px→16px(lg)；尖峰页改挂 page-padding 验证全局工具类链路。

### 补记 11：app-dialog 平台聚合（用户拍板：插槽退化文本，App=dialogPage/MP+WEB=page-container）

架构=条件编译铁律标准形态（视图分叉双实现+入口按平台引）：
- **入口 API 统一文本 props**（visible/title/desc/cancelText/confirmText）——插槽跨 dialogPage 页面无法传递，用户拍板退化；协议弹窗 desc 里的行内链接交互随之丢弃（本来是 toast 占位）
- **APP=dialogPage**：pages/dialog/dialog.uvue（蒙层自绘+卡片，框架背景固定透明铺满）；通信=url query 带参（encodeURIComponent）+uni.$emit('lh-dialog-result') 回传；**收起单点化**=页面只 $emit，入口 watch(visible=false)→closeDialogPage(openedDialogPage) 统一关（dialogPage 页面内无参 closeDialogPage 关自己语义存疑，绕开）；back 键=取消语义（onBackPress emit+return true）
- **MP/WEB=page-container 组件式**（原实现，template 渲染 title/desc 文本）
- 分叉落点：template #ifdef APP 空 view / #ifndef APP page-container 结构；script #ifdef APP watch+$on 逻辑 / #ifndef APP 直 emit；style #ifndef APP 包裹
- 语义要点：dialogPage 蒙层页面自绘（模态=蒙层不响应点击）；蒸汽下页面默认嵌 scroll-view（注册配 disableScroll:true）；dialogPage 不进页面栈（getCurrentPages 拿不到，事件总线是唯一回传通道）
- 消费方：Login/index 插槽→props，孤儿样式清理

### 补记 12：app-dialog 退役，弹窗采纳 uni.showModal（用户真机对比拍板）

尖峰页并排对比（app-dialog 聚合 vs uni.showModal）后用户拍板：**showModal 样式够好+官方维护+全端一个 API+暗色系统级自动 → 采纳原生，app-dialog 退役**。

- **删**：components/app-dialog（page-container/dialogPage 双实现聚合）、pages/dialog/dialog.uvue、pages.json 注册、index 两张测试卡、Login 协议弹窗组件引用与 protocolDialogVisible 状态
- **换**：Login.openProtocolDialog 直调 `uni.showModal`（title/content/cancelText「不同意」/confirmText「同意」/cancelColor tertiary/confirmColor 主题蓝，success 回调分流 handleProtocolConfirm/Cancel）——pendingProtocolAction 确认后续执行链路完整保留
- **知识沉淀**：uni.showModal 内部就是官方 dialogPage 封装（返回 UniPage 也是 x 增强）；能力面=文案/双按钮/showCancel/按钮色/editable+placeholderText 输入弹窗（x 增强，S3 场景备用）；**容器视觉（宽度/圆角/遮罩/动画）不可定制**——那是 app-dialog 聚合方案的存在意义，方案已留档（dialogPage 文本 props 聚合+收起单点化+back 键取消），真出现富内容/容器定制需求按档重建
- S2-01 弹窗基础件计划更新：app-dialog 退役 → **showConfirm（showModal 的 Promise 封装）**，S3 注销/改密确认直接用

### 补记 13：app-checkbox 自建（用户反馈内置 checkbox 不好看，要求 sard 形态）

sard checkbox 真实形态拆解（源码）：**不是自绘框+勾叠层，是 check-icon 单元素双态**——未选=灰空框（20px、1px fourth 色边框、圆角 0.15em≈3px），选中=**border-color transparent 框消失+纯 primary 色勾图标**（sari 字体）。x 端复刻：uni-icons `checkmarkempty` 替代 sari 勾（uni-icons 无 sard 那种一体双态框勾图标），框 view+勾 icon 条件渲染。app-checkbox=checked(v-model)+label+change 事件；内置 checkbox（foreColor 唯一定制点，形状/大小不可控）退役。暗色全走语义 token（fourth/primary/emphasis）。

### 补记 14：app-checkbox 语义补齐 + checkbox-group（用户拍板三项+group）

自绘 checkbox 语义面补齐三件：disabled（token 置灰+onClick 拦截）、点击态（touchstart/end 维护 pressed→opacity --lh-active-opacity，不用 hover-class=未查证）、aria（aria-role=checkbox+aria-label=label）——放弃项=form/checkbox-group 原生联动（手机弱需求，登记）。

**app-checkbox-group（provide/inject 受控模式）**：子 checkbox inject 上下文后双模式——有 group=isChecked 随值集合（includes 闭包读 props 保响应性）+点击转 group.toggle(value→集合增减→update:modelValue+change)；无 group=独立 v-model:checked 现状。子项需 value prop（string）。横向布局不做 prop（纵向容器默认，横向=页面自排，不提前写）。group 级 disabled 传播未做（子项各自 disabled 已够）。

### 补记 15：aria 属性赌输（编译 warn 实锤）

自绘 checkbox 的 aria-role/aria-label 在 x view 上**无官方通道**（view/common 属性表全文无 aria；唯一相关 getAccessibilityInfo=识别辅助应用服务，与标注无关）——无障碍语义=自绘 view 的放弃项（与 form 联动同列）。属性已移除。

### 补记 16：checked 可选化 + demo 页未来结构登记

- group 模式下 checkbox 不传 checked（受控于集合）触发 Missing required prop warn——`checked?: boolean` 修正（group 分支不读该 prop，独立模式调用方均传）
- **demo 页未来结构**（用户规划）：个人中心总入口（list 组件，S2-01）→ 二级菜单（title=组件名，list）→ 组件示例详情（checkbox/input 等）。当前平铺单页=临时形态，list 组件到位后重构

### 补记 17：登录页结构轻对齐 web（用户提出领域工厂对齐+多登录方式预判）

web 登录结构范式=外壳层 initXxx 工厂编排（initChangeComponent/initUserSetup）+领域子组件（Login/Register）。x 版差异：app 的组件切换=页面导航（Register 独立页），外壳层的 app 形态=登录域页面编排（未来微信/手机号登录=页面切换编排需求，登记不实现）。

本轮轻对齐：抽 **initPostLoginCheck 工厂块**（对齐 web initUserSetup 语义：校验项获取+routeAfterCheck 向导/首页分支），handleLogin 成功分支只剩一行 `await routeAfterCheck()`——四工厂变五，行为零变化。**重对齐（外壳/领域组件拆分）不适用**：x 版无组件切换外壳需求。

### 补记 18：登录页 init 工厂对齐 web skill 规范（用户读 skill 指出）

**lihua-web skill 第 17/18 条 = 本项目页面状态组织的正式规范**（2026-09-03/09-24 定）：「页面状态按职责分组成 initXxx() 工厂——类型定义、状态、方法、**watch 声明**在工厂内，return 导出，setup 顶层解构消费；顶层不出现散装业务函数；跨工厂依赖经顶层解构名引用（**后声明的工厂可用先解构的变量**）」。

Login.uvue 按"顶层零散装"重构，六工厂+声明顺序（依赖决定）：
1. initPostLoginCheck（无跨厂依赖）
2. initProtocol（key 状态/弹窗/取消/确认/to 协议页跳转——协议域完整化，toAgreement/toPrivacy 归位）
3. initLogin（checkLoginData/handleLogin——引用 checkProtocol/openProtocolDialog ✓ 前解构）
4. initRememberMe（写 loginData ✓ 前解构）
5. initCaptcha（serverConnectionFailed 挪入+handleLoginClick 分发——引用 checkLoginData/handleLogin ✓）
6. initRegister（isRegistrationEnable/toRegister——引用 checkProtocol/openProtocolDialog ✓）
7. initEntry（onRegisterSuccess/reload/onMounted/onUnmounted——生命周期声明进工厂 ✓，引用三厂导出）

解构依赖顺序是这类重构的硬约束：被引用者先声明。行为零变化。

### 补记 19：安全区避让独立工具类 .safe-top（用户架构拍板）

**分层原则=安全区语义与页面布局解耦**：common.scss 新增 `.safe-top { padding-top: var(--status-bar-height) }`（custom 导航页最外层挂载；padding 实现=等价 margin 且无父子折叠风险；Web 端变量为 0 天然退化）。auth-body 的 margin-top 40% 弃用（按页宽解析在横屏/iPad 分屏暴涨）改 120px 净距（状态栏由外层管）。MP 分支同步 120px（胶囊行 44px+状态栏 < 120px 安全区内无冲突）；WEB 分支保留 min(20vh,40%)（浏览器无状态栏，safe-top 天然退化）。内置变量 --status-bar-height 为官方 custom 导航推荐用法（App 4.61+ 自动响应变化）。

### 补记 20：POW UTS 原生插件实战（④ 尖峰，双端实测通过）

**插件形态**（原生混编规范）：`uni_modules/lihua-pow/utssdk/` 下 `interface.uts`（纯类型，无 export default/无 interface Uni{}）+ `app-android/{PowMiner.kt,index.uts}` + `app-ios/{PowMiner.swift,index.uts}`；Kotlin 包名=默认包名规范 `uts.sdk.modules.lihuaPow`（胶水层按包名 import）；设计=**挖矿循环整片下沉**（mineSlice(salt,target,start,maxTries) 一片 5 万次原生跑完，桥调用仅 1 次/片——现成 sha256(str) 型插件每 nonce 跨桥反而吃掉原生优势）。

**编译磨错两坑（首轮 xcodebuild）**：
1. **UTS 函数类型无 throws 概念**——胶水层 `throw new Error` 生成 Swift throwing 函数，赋给非 throwing 的 MineSlice 类型报 invalid conversion；修复=守卫改 -2 哨兵返回（JS 参考版保留 throw 不动）
2. **Number.from 在 iOS 编译器只生成 String 重载**（文档示例 Number.from(Int) 与本机 5.34 实际不符）且字符串拼 number 不隐式转换；修复=Swift 函数直接返回 NSNumber（映射表原生口径），胶水层裸 return，日志不拼数字

**基座机制实证**：Mac 真机运行（标准基座）时 UTS 插件由本地 xcodebuild **即时编译**进 app（unimoduleXxx target，需 Xcode 环境）——开发期无需打自定义基座；运行报 `undefined class: UTSSDKModulesXxxIndexSwift`=当前运行的基座里没有该插件（选错基座/旧基座），与 uni-network 缺模块同款签名。

**双端实测**（尖峰页端到端：对拍自检→取码→挖矿→提交）：iOS（现代机）**80-220ms**、安卓骁龙660（2017 中端）**~1300ms**，门槛 2s；对比旧纯 JS iOS 基线 6.5s（JSCore 无 JIT）提升 30-80 倍。对拍探针（真实摘要构造必然命中 target）双端 JS/UTS nonce 全等。原生路线结论=POW 这块硬骨头已消，验证码 UI 原生自绘可行性大增。

### 补记 21：插件根 JS 回退 + 手抄常量教训 + 微信 iOS POW 水位（④ 尖峰小程序侧）

**UTS 插件根目录 `utssdk/index.uts` = 跨平台回退入口**（文档规则：分平台目录缺失时回退根入口）——补上后微信小程序编译过（此前报 Cannot find module=插件无该端实现）；Web 端将来同走此路；app-android/app-ios 有分平台目录优先原生，互不干扰。

**手抄密码学常量的两条铁律**（本轮 K 表第 41 个值 `0x983e5152` 抄成 `0x98e5152a` 数字换位，App 原生实现没中招、只有根 JS 回退中招）：
1. **抄完必须 diff 校验**——`diff 原版 抄写版` 一步就能抓住，肉眼审不可靠
2. **对拍验证脚本要防「低难度首命中失真」**——以 digest(nonce) 前 N 位构造 target 时，低难度（如 1 位 hex=1/16 命中率）下构造 nonce 之前天然存在更早命中者，mineSlice「首命中」语义返回更小值是正确行为却被误判 FAIL；验证须用高难度（8 位=1/2³² 前例命中可忽略）+双断言（返回值 digest 真匹配 target）

**微信 iOS 真机纯 JS POW 水位 ≈15s**（26 万次哈希，~17k H/s，JSCore 无 JIT）——已知物理水位非 bug；处置=S6 验证码分端配置（3.1.0 已有能力）：小程序端不配 POW 配图形验证码，或服务端下发低难度 powParam。wx worker 旧方案只保 UI 不卡不缩时长，不作主案。对比 App UTS 原生 220ms=**70 倍差距**，是原生路线价值的实测注脚。

### 补记 22：POW 引擎四端定态 + 小程序无 WASM 实锤 + 两个工程教训（④ 尖峰 wasm 优化轮）

**引擎四端定态**（插件目录显式对称，无根回退）：app-android=Kotlin MessageDigest（~1300ms 骁龙660）/ app-ios=Swift CryptoKit（80-220ms）/ **web=hash-wasm**（浏览器恒有 WebAssembly，node 参考 8800 万 H/s，插件唯一 import 处）/ **mp-weixin=恒纯 JS**（iOS 真机 ~15s，分端配置规避）。

**小程序逻辑层全线无 WebAssembly（实锤定案）**：hash-wasm 自身环境探测抛 `WebAssembly is not supported in this environment!`（stack=createSHA256→WASMInterface），iOS/Android/**开发者工具模拟环境**一致无此全局——旧仓「小程序 iOS 无 WASM」扩展为全端无，平台级事实不可修。连带定案：**wx.createWorker 上限 1 个=并行计算不可行**（worker 只保 UI 不缩时长，同引擎同吞吐）；小程序 POW 提速唯一出路=端配置（分端配置不配 POW / 降难度参数），客户端已无事可做。

**工程教训一（writer 串扰 bug）**：同文件内 wasm 段（55B BUF）与纯 JS 段（64B BLOCK）曾共用一套 writeAscii/writeNonce——回退 JS 时盐值写进 BUF 而 compress 读 BLOCK，digest 全错对拍必炸。**两段各持缓冲就各配一套 writer，勿为省行数合并**（旧仓两文件各自带 writer 正是此意）。

**工程教训二（回退路径按回退形态测）**：wasm 链首轮本地验证先跑 prepareEngine 再测——wasm 分支全过而回退分支从未真正执行，串扰 bug 漏网到真机。**回退路径必须以「不初始化加速引擎」的形态单独跑 harness**。

### 补记 23：swipe 收起态结构重排——H5 露边根治（首次完整 H5 回归轮）

**现象**：H5 首次完整回归，侧滑行收起态行缘露彩带色发丝线。露头的是该侧最宽的底层彩带（右组「标星」金、左组「已读」灰），各约 38% 个物理像素；单钮侧不露。

**定位（对数法：截图像素反推 + 浏览器量测）**：H5 文字实测宽 30.6px（非 30）→ 彩带宽 62.6/125.2/187.8 全是小数；旧结构收起靠「translateX(自身宽) 出裁切区」，被绘制的边与裁切边各自吸附物理像素——2 倍屏下三档的小数部分 .203/.406/.609，最宽一档边缘落进裁切区内 0.39 物理像素，与截图像素吻合。对照实验三连（H5）：宽度取整→露边消失；恢复小数→原样回来；保留小数、藏外位移多推 1px→消失。小程序走字符估算（整数宽）不触发，App 未见。

**决策（用户拍板）**：不打补丁（加余量/不绘制开关），改结构——彩带不再「停行外靠裁切藏」，改为恒贴行缘、收起宽 0、展开按进度长出。隐藏态不再存在贴边的被绘制边，问题从结构上消失，不依赖任何余量数值。评估后否决：经典「按钮固定+内容层盖住」结构，只是把重合点从组件裁切层挪到卡片边缘。

**新结构要点**：① 彩带自身 `overflow:hidden` 裁文字；② 文字外包绝对定位容器（宽=文字宽，显式定宽；钉前缘内距 16，上下撑满居中），左右两组靠 `--left` 修饰类镜像，定位公式统一（原左组要补「上层总宽」偏移）；③ 确认链「按钮排滑出」「确认条整体滑出」改为宽度收拢到 0；④ 同值宽度免写（静止侧不逐帧重写）；⑤ 首帧仍沿用 999px 藏外 + 裁切层（量测须在未定宽形态下做，盖线 1px 也靠它）。

**结构模拟先行**（改码前用内联样式模拟三个静态瞬间，与旧结构逐像素对比）：收起四行边缘像素全等；半展开差异 0.6% 且全在彩带前缘列（可见边的亚像素吸附差）；全展开逐像素一致。

**改造中抓到第二坑（坑⑩）**：首帧 999px 位移写在 `:style` 载体里，量测后只命令式清成 none——父组件重渲染（删行）后被打回 999px，行能滑开但按钮区空白。旧结构每帧重写位移所以不显，新结构不逐帧写位移即致命。修复=适配器新增 `settle`，载体与元素同步置 none。

**回归中顺带修掉的原有隐患（坑⑪）**：app/H5 按序号从 v-for 元素引用数组取彩带，而引用数组序=打补丁序——按钮列表在前面插入项后序号与元素错位（实测展开中 2→3，三块彩带宽度互换）。旧结构同样错位，因按钮列表通常静态而未暴露；MP 按模板 index 取载体不受影响。修复=彩带 v-for 改序号 key（原地更新不搬运）。H5 复测三情形全对：收起变少、变少后展开、展开中变回（125.2/83.47/41.73=叠塔宽×进度 0.667）。

**H5 回归**（合成触摸事件驱动逐项量测，数值全部对上公式）：收起四行边缘像素全等；拖拽三段各 w×p、文字恒距前缘 16；松手过半展开落 fan；回拖过半收起、收起域轻扫展开；橡皮筋拖 300px 实测 210.75/140.5/70.25（公式 210.76/140.51/70.25）；弹簧回位落 fan；确认链最内/最外钮、取消滑出、文案残留还原；loading 归心（右组 spinner 左锚 lead 12、左组右锚 lead 5）；删行后剩余行不偏移、再展开正常；互斥收起；按钮列表变化重测量。

**待真机验证（用户执行，回退靠 git）**：① App iOS/安卓：线性段由只写位移改为逐帧写宽度后的流畅度（老安卓重点）+ 快速乱滑压测；② 挂载量测在首帧形态下仍取到真值（取到 0 会静默退回字符估算）；③ 0 宽原生视图不绘制；④ 文字容器显式定宽与镜像钉位的两端表现；⑤ 微信小程序真机（开发工具会掩盖问题）；⑥ 鸿蒙无基线；⑦ 序号 key 原地更新在 App/MP 的表现。

### 补记 24：swipe 开态起拖不接盘对侧——跨域整段阻尼（用户提出，观感轮）

**现象**：双侧行一侧已展开时往对侧拖，内容层越过中线后线性滑向对侧（对侧彩带按比例长出），观感如同「直接打开了另一侧」，松手才收起。

**决策（用户拍板）**：开态域起拖不接盘对侧——压向对侧的位移自中线起整段阻尼，松手复原到收起态。收起结果与原逻辑一致，只改拖拽观感。

**实现**：① 判定横滑时记起拖域，开态域起拖则把对侧记为阻尼侧（`crossDamp`，仅拖拽期间有效）；② 新增 `effOf(x)` 统一折算 content 有效位移——跨域阻尼与同侧过拖共用 `rubberOf`（d=max(32, 对侧组宽×0.25)，k0=0.4）。条目四右开往右拖，手指过中线 70/100/150/200/250px，内容层只走 2.8/11.3/20.0/25.3/28.9px；③ 松手在受阻位：原始位移折回有效位移后走收起补间；④ 开/收入口起点归一（拖拽中的原始位移先折回有效位移）——否则停在受阻位时被互斥收起，补间会从原始值（可达数百 px）起跳。

**顺带删除**：原「跨域橡皮筋例外」分支（对侧永远到不了橡皮筋区，不可达）；阈值判定里因此恒真的 `!fromL`/`!fromR` 守卫；`closeWithInertia` 无人读取的侧参数。同侧过拖时被互斥收起会跳一下是原有问题，入口归一一并解决。

**H5 实测**：右开→右拖、左开→左拖两向曲线均吻合公式；松手复原到收起；同侧过拖、跨域后拖回保持展开、未过中线松手收起、受阻位被互斥收起不跳、收起态长滑展开、删除链/确认/取消回归均正常。待真机：阻尼手感——曲线与过拖一致，嫌重或嫌轻调 `rubberOf` 的 k0 与 d。

### 补记 25：验证码去 dialogPage——页内组件 + app-mask（app-mask 补齐全窗口遮罩之后）

**背景**：验证码在 App/Web 上原本经 dialogPage 壳挂载（proxy/active 双模式），目的是拿全窗口蒙层——页内 fixed 遮罩盖不到原生导航栏与状态栏。代价是一整套跨页通信：成功结果走 `uni.$emit` 总线、主题色编码进 url、壳页加 `pages.json` 条件注册；dialogPage 内还有量测（selectorQuery 查不到组件元素）与动效（requestAnimationFrame 炸流程）两批坑。微信端没有 dialogPage，一直是业务页直接挂载。

**决策**：app-mask 补齐「页面内层 + 导航栏/tabBar/状态栏原生条带」后，四端统一到页内这条路径；对外用法不变（`<Captcha ref themeLight themeDark @success>` + `open()`）。

**结构**：组件根是零尺寸占位，下面两个同父兄弟——`<app-mask :visible>` 负责压暗，全屏浮层 `.lh-cap-mask`（fixed、层序 1000）拦截触摸、居中卡片，不再自己画背景。与 app-sheet 同构，对应坑⑧「需要互相压盖的层做成同父兄弟」。消费方须把 `<Captcha>` 挂在页面根的直接子级，不嵌进卡片。

**dialogPage 原本白送的三样，页内要自己补**：① 返回拦截 → 组件内 `onBackPress`（打开时走本体 close 并拦下）；② 模态防重开 → `open()` 加「已打开则忽略」守卫；③ 开新页时键盘自然收起 → `open()` 里 `uni.hideKeyboard()`。

**踩坑：`uni.hideKeyboard` 要进基座。** 真机一点登录就抛 `undefined class: UTSSDKModulesDCloudUniKeyboardIndexSwift, uni-keyboard 模块不存在，请重新打自定义基座`，`open()` 在 `visible.value = true` 之前被打断，验证码根本不打开。它在 App 上由内置 UTS 模块 `uni-keyboard` 实现，自定义基座只编入项目用到的模块；这次是该 API 首次被使用，现有基座自然没有。识别方法：API 文档页顶部的 `::: sourceCode` 指向 `uni_modules/uni-xxx` 的，都是这类模块，首次使用后要重打基座——兼容表只说明平台支持，不说明要不要进基座。处理：调用处包 try/catch（缺模块时键盘不自动收起，但不阻断打开）+ 重打基座。未选 `UniElement.blur()`：它不进基座，但要 `app-input` 暴露 blur、各调用页逐个输入框去调，且微信端不支持。

**删除**：`mode` prop 与 proxy/active 全部分支、`uni.openDialogPage` / `closeDialogPage`、`lh-captcha-success` 总线、壳页 `pages/captcha/captcha.uvue` 与其 `pages.json` 条件注册。点选题量测逻辑未动：App/Web 仍走缓存的 `$page.getElementById`，微信回退 selectorQuery。

**未处理**：iOS 侧滑返回默认不拦——验证码打开时从左缘侧滑会退掉整个页面（原来关的是 dialogPage）。要拦需给页面配 `swipeBackAsBackPress: true`，代价是该页平时的侧滑不再跟手；滑块钮离左缘约 50pt，不在侧滑触发区，暂不加。

**待真机验证（用户执行）**：五种题型（重点点选题落点，App 上量测改走业务页路径）、返回键、切后台、亮暗与主题色、注册页、Web、微信端；安卓须先重打含 lihua-mask 插件的基座。app-mask 自身四项改动（切后台不摘条带、页面内层显示时创建、Web 变量替换、补间首帧同步）也尚未回报真机结果。

### 补记 26：POW 转圈卡顿——挖矿挪到后台线程（用户提出「放慢留资源」，改走后台线程）

**现象**：验证码 POW 题挖矿期间，滑块钮上的转圈动画很卡。

**原因**：不是 CPU 被抢，是主线程被占。官方文档（`uts-for-android.md` 线程环境差异）写明 uni-app x 的页面逻辑默认执行在 `main` 线程，iOS 同理；画面提交也靠主线程。原调度每片同步调原生 `mineSlice` 连算 5 万次哈希，算完才经 MessageChannel 让出一次。按补记 20 的实测（iOS 整轮 80–220ms、约 5–6 片），每次占住主线程 15–45ms，转圈只能在片与片之间挤出几帧；第一片更是在 `powPhase` 切到 `mining` 的同一拍同步开算，转圈元素首帧还没提交就被挡住。

**否决「放慢」**：主线程分片要给每帧留空档（≥16ms），挖矿实际只能占约三分之一时间——iOS 从 0.1–0.2s 变 0.4–0.6s，骁龙 660 一类机型从 1.3s 变约 4s，超过 2s 门槛。它唯一的好处是不用重打基座，而这次两端基座本来就要重打（`uni-keyboard`、`lihua-mask`）。

**实现**：lihua-pow 插件新增 `mineSliceAsync(salt, target, start, maxTries, onDone): boolean`，计算复用现有同步函数，只是换线程执行、结果回主线程回调——iOS 用 `DispatchQueue.global(qos: .userInitiated)` 加 `DispatchQueue.main.async`；安卓每片起一个 `Thread`，结果经 `Handler(Looper.getMainLooper()).post` 回主线程。Web/微信导出同名空实现返回 false，调度器回退原路径。调度器 `pow/index.ts`：返回 true 则片完在回调里续下一片（不再经 MessageChannel）；返回 false 走原同步分片，并把「先让出再算」补到第一片。取消语义不变：取消后不再续片，在途那一片算完即丢弃。

**回调生命周期**：HBuilderX 4.25 起 UTS 插件导出方法的回调参数触发一次后即自动回收（默认只能触发一次）；这里每片新传一个回调、正好触发一次，无需 `@UTSJS.keepAlive`。

**胶水层写法**：回调参数直接透传给原生函数。依据是已编入基座的 mask 插件编译产物：UTS 函数类型里的 `number` 即 `NSNumber`、`() => void` 即 `@escaping () -> Void`。超范围难度（>32 位）在胶水层返回 false，交同步路径按 -2 哨兵处理，语义与原来一致。

**验证**：调度器是纯 TS，用 Node 做了逻辑模拟——后台回调与回退同步两条路径解出的 nonce 完全一致，并用真 SHA-256 逐个核对；两路径中途取消均以空串收场，取消后不再续片；严格类型检查 0 报错。原生代码（Swift、Kotlin、uts 胶水）本地编译不了，**待重打两端基座后真机验证**：转圈是否连贯、挖矿时长是否与以前相当、挖矿中刷新或关闭有无迟到结果、首页 POW 自检卡是否照常。

**可选下一步**：`num` 个挑战互相独立，可并行跑多核进一步压缩慢机时长（本次未做）。

### 补记 27：遮罩显示期间锁住返回（返回键、返回手势、iOS 侧滑）——用户提出「遮罩上半截不随转场动画，会露馅」

**现象**：遮罩打开时侧滑返回或按返回，页面被转场动画带走，挂在窗口上的原生条带留在原地。

**原因**：两条返回路径不同。返回键、安卓返回手势、导航栏返回、`navigateBack` 都走 `onBackPress`，返回 true 即拦；iOS 侧滑返回是 `UniAppRootView` 上一个屏幕边缘手势驱动的交互式转场，官方文档明写「iOS 端侧滑返回不会触发 onBackPress」，手势一开始页面就跟手走。此前只有验证码、抽屉各自监听了 `onBackPress`，app-mask 自己没有；iOS 侧滑在补记 25 里记为「默认不拦」。

**实现**（只改 app-mask.uvue，不动原生插件）：
- `onBackPress`（APP || WEB）：显示期间返回 true 并发 `backpress` 事件。拦截只在遮罩这一处，关不关归调用方——验证码写 `<app-mask :visible @backpress="close()">`，自己不注册 onBackPress；抽屉仍保留自己的监听。两者不冲突：框架对 onBackPress 是把页面上的监听器全部执行一遍、结果取 `.some(o => o === true)`，不短路。
- iOS 侧滑：原生层挂上时 `page.setPageStyle({ disableSwipeBack: true })`，摘掉时还原原值（第一次锁时从 `getPageStyle().getBoolean('disableSwipeBack')` 读）。三处摘层（进度归零、被别的页面盖住、卸载）收口为 `detachNative()`。

**依据（拆 22:03 的 iOS 调试包）**：①手势开始时 `UniAppRootView.resolveSwipeBackContext` 解析目标页并检查 `disableSwipeBack(for:)`，为真则不响应，即每次手势实时读取，运行中改了立刻生效；②`-[UniPageImpl setPageStyle:]` 的调用序是先 `mergeResolvedPageStyle:`（合并进页面现有样式，不把其他样式重置成默认），再 `setDisableSwipeBack:`、`syncPageSystemUI:`；③框架内置的一键登录页（uni-verify）自己就在 onShow 里调 `setPageStyle({navigationBarTextStyle, disableSwipeBack: true})`。文档的 PageStyle 兼容表把蒸汽端的动态 `disableSwipeBack` 标成不支持，但运行时与框架自身代码都在用。

**顺带修正检查脚本**：本地类型自查脚本此前没处理行首缩进，条件编译块其实没被裁掉，等于四端代码合在一起查；修好后重查，结论不变。另外 `setPageStyle({ … })` 字面量传参在标准 TS 下报「不可赋给 UTSJSONObject」（接口上声明了方法成员），这是 TS 与 UTS 的规则差异，UTS 按文档写法接受。

**待真机验证（用户执行）**：iOS 遮罩显示期间侧滑无反应、收起后恢复跟手；安卓返回键与返回手势只拦不退页（含安卓 14+ 的预测性返回动画是否先于 onBackPress 播放）；验证码、抽屉打开时按返回仍能关掉自己且页面不动。

### 补记 28：抽屉内容滚到边不带动页面（用户提出「滚动条打架」，Web + 微信小程序）——小程序端顺带获得「内容在顶部下拉带动面板」

**现象**：抽屉内置列表滚到底后继续滑，页面跟着滚；Web 上鼠标滚轮同样（上一轮遗留项「列表滚到底继续滚会带动背景」）。

**原因**：两端机制不同。Web 的滚动区与页面都是浏览器原生滚动，内容到边后余量沿滚动链传给文档；小程序没有等价的 CSS 属性，官方只有 `page-meta`（须是页面第一个节点，组件内放不了）——`wx.setPageStyle` 这个 API 不存在（搜索摘要里的转述有误，官方文档 404）。

**Web 实现**：`.app-sheet-scroll :deep(.uni-scroll-view) { overscroll-behavior: contain }`（`#ifdef WEB`）。Web 的 scroll-view 根节点不滚动，须穿透到运行时内建的滚动层（坑⑬）。

**小程序实现**（`app-sheet-guard.wxs`，视图层同步执行）：内容层上绑 wxs 守卫——按下时按内容层与滚动盒子的位置差量出当前位置，之后按手指位移预判；已到边仍朝外的移动返回 false，其余交给原生滚动。不锁整页，调用方页面不用改。

- 第一版把守卫绑在组件根上，实测无效：小程序的滚动区把内部 touchmove 截住，外层收不到（坑⑭）。改绑内容层。
- 守卫拦下的移动不再冒泡；抽屉原有的手势跟踪绑在面板根上，在小程序上本来也收不到内容区的移动。内容层内侧加一层绑同一组处理函数（仅小程序端，条件编译注释拆开始标签）。副产物：「内容在顶部时下拉带动面板」在小程序上首次生效。
- 面板根加 `catchtouchmove`（仅小程序端）：面板内任意位置的触摸移动就地拦下，页面不跟着滚（短列表下方空白区、淡入层等原本会带动页面）。

**后续修复（用户反馈「有时往下滑不关闭抽屉」）**：

- 松手速度改用事件自带的 `timeStamp`：小程序逻辑层触摸事件成批送达，按处理时刻算会把一批算成同一毫秒，速度归零；带动面板之前的移动也采样，松手事件再补采一次（间隔上限放宽到 100ms）。
- 「内容在顶部」除滚动事件外，另以守卫按下时量到的位置、顶边拦下时回传的状态为准（wxs 经 `callMethod` 调 `onGuardStart` / `onGuardTop`）——滚动事件同样成批节流，到顶后的最后一条可能送不到逻辑层。

**结构整理**：写层（双写载体、按 id 取元素、挂载后延迟重写）原来散在 7 处、9 组条件编译，收敛成一个 `writer` 适配器（`panelStyle` / `fadeStyle` / `move` / `fade` / `dropFadeNode` / `rewriteAfterMount`），平台分叉只剩 1 处；同时删掉排查用的诊断日志。组件条件编译标记 32→19（写层 11→2），行数 1319→1264。

**验证**：

- Web（浏览器实测）：规则生效时，内容在底部继续滚 ×4、顶部继续滚 ×3、中段来回滚，页面位置都不动；对照（临时关掉规则）内容到底后页面 420→1113。合成触摸回归：内容顶部下拉面板跟手、内容不在顶部不动、拖标题行收起。
- 小程序（开发者工具模拟器，自动化真实触摸）：守卫按下时量到的位置与真实滚动位置一致（0 / 240 / 1740，上限 2607），每步预判与实际逐步相同；中途到底后 14 步判拦、底边重新起手 4 步判拦、底边向内放行并精确回滚、中途到顶后判拦、顶边重新起手 4 步判拦。回归：头部下拉面板跟手（183→213→243→273，松手回位）、内容顶部下拉面板跟手（183→205→235→265）。

**未验证**：① 小程序上守卫对页面滚动的实际拦截——自动化注入的触摸不受 catch / preventDefault 约束（头部的 catchtouchmove 在自动化下同样拦不住页面），模拟器里连「到底后带动页面」都复现不出，只能真机确认；② 「下滑不关闭」修复与面板根 `catchtouchmove` 尚未真机回归（后者要确认不影响列表滚动、空白区拖动关抽屉仍正常）；③ App 端未重新编译（写层适配器与 Web 走同一分支，Web 已编译通过）；④ Web 触摸滚动依赖浏览器对 overscroll-behavior 的支持（iOS 16+、Chromium、Firefox），本机只验了滚轮；⑤ `#body` 裸内容模式两端都没管（调用方自带滚动容器）。

**撤回记录（页面滚动条）**：曾尝试按抽屉开合隐藏小程序页面滚动条，组件内没有可行手段——`page-meta` 必须是页面第一个节点、`wx.setPageStyle` 不存在（官方文档 404，开发者工具包全文无此符号），只能全局 `::-webkit-scrollbar` 隐藏；实测 iOS 上该 CSS 对系统滚动指示器无效（安卓与开发者工具有效），已撤回。Web 端「遮罩期间隐藏页面滚动条」的补丁也一并撤回（iOS Safari 同样无效）；Web 的 `overscroll-behavior` 保留。

**遗留**：Web 鼠标滚轮落在遮罩、标题行上仍会带动背景（uni-app x 没有 wheel 事件类型，模板里绑不了）。

**实测方法与工具坑**：见 `skills/cross-platform-pitfalls.md`「小程序端自动化实测注意事项」。

### 补记 29：app-sheet 自动高度（auto-height）——按默认插槽内容量高

**需求**（用户提出）：抽屉不传 height、不给默认插槽定高，直接放元素，组件就按内容自然高度展开为合适的高度；作为 action sheet / 短表单 / 短列表一类抽屉变体的统一入口。

**决策**：新增 `auto-height` 布尔属性（默认关，保持既有用法不变）。自动高度时忽略 `height`，面板高度=头部实高+默认插槽内容的自然高度（含 `.app-sheet-bottom-safe` 的安全区占用），封顶页面内容区；内容超高时仍由面板内 scroll-view 滚动。`#body` 裸内容模式不适用（滚动容器由调用方定高）。

**量取**：一次 `selectorQuery.exec` 同时量 `.app-sheet-header`、`.app-sheet-content`（仅自动高度时）与左右槽宽。`.app-sheet-content` 是 scroll-view 的内容层，高度即内容自然高，不受滚动视口高度影响（Web 已实测；App/MP 待真机）。

- 打开流程：`measure()` 先给临时几何（占满内容区）、挂载并显示在关闭位 → `nextTick` 量取 → 应用面板高度 → 从关闭位入场。自动高度在入场前等待量取结果，避免面板先按临时高度展开再跳一下。
- 量不到（元素未登记/布局未就绪）按 32ms 重量，最多三次；仍失败按临时几何打开，不阻断。内容区元素不存在（`#body`）不进入自动高度。
- 打开后内容变化：动画/拖动中收到的重量请求只记待量标记，收尾后补量，避免改在途动画的目标。组件在 `onUpdated` 里也挂了重量，但实测页面侧改默认插槽内容（v-for 行数变化）时面板没有跟着变——这条路径为什么没生效没有查。**目前验证过的做法是调用方在 `nextTick` 后调组件暴露的 `fit()`**（demo 的「增加一行」即此用法）。
- 露头模式走同一路径（设计如此，未测）：关闭位只露头部，展开高度按内容；内部几何（`panelH`/`yClosed`）变化不改变关闭位的可见高度（恒为头部高度）。

**顺带修复 Web 位移**（发布版构建 `cli publish web` 实测；此前面板完全不位移，露头抽屉关闭态摊在展开位）。两个独立原因：① 取元素——Web 产物里 `$page.getElementById` 这条路径被折成常量 `null`，元素永远取不到；Web 改经 `utils/dom.ts` 的 `document.getElementById` 取，App 仍走 `$page.getElementById`。② 写样式——写层 `move` 原是一句 `panelNodeOf()?.style.setProperty(...)`，产物里是空函数体；改成局部 any + 判空后保留。两者都与模板字符串无关；②的触发点跟着被调函数走，具体原因没有分离出来，对照变体见 `skills/cross-platform-pitfalls.md` 坑⑯。另把布局判空的 `rows > 0` 改成布尔 `hasHead`：Web 编译把 `A+B > 0` 内联成 `(A)+(B>0)`，含把手行时判空恒真（坑⑰，按产物推演）。

**验证**：Web 发布版构建 + 浏览器实测（1280×720）——露头抽屉关闭位只露把手 48、开合与 open/close 事件正常；自动高度短内容面板 273=头部 56+内容 217、底边贴视口底；调 `fit()` 增行后面板 273→324、底边不动；30 行内容封顶 676（视口 720−导航栏 44），内容 1531 在 620 的滚动视口内可滚到底 911；关闭过程淡入层正常；普通抽屉入场正常。mp-weixin 与 Web 编译通过，两端产物里的布局判空均为布尔形式。**未验证**：App 端未编译（写层的取元素与写法改动涉及 App 分支）；微信小程序未上真机；Web 开发版构建未验；本轮没有重跑触摸拖拽、head 切换、60%/400px 与 `#body` 抽屉的回归；露头+自动高度组合 demo 未放、未测。
