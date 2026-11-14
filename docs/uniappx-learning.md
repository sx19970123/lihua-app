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
