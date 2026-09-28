---
name: lihua-app
description: 指导 lihua-app 仓（UniApp + Vue 3 + sard-uniapp 移动端）的开发与验证。适用于 src/api 与 TypeScript 类型、pages.json 与页面分包、sard 组件、Pinia 状态、路由守卫、App 专用后端接口、字典、附件、通知、主题暗色、跨平台条件编译与环境版本基线。
---

# 狸花猫 App 开发（lihua-app 仓）

处理本仓改动时使用。App 专用后端接口（`app/...` 前缀）由兄弟仓提供（`lihua` 仓 / `lihua-cloud` 仓的 `controller/app`），契约细节见对应仓的 backend skill；Web 管理端对应 `lihua-web` 仓。

## 代码地图

- API 层 `src/api`（全局响应类型 `src/api/global/type.ts`）；请求封装 `src/utils/request.ts`；页面注册 `src/pages.json`。
- 主包页面 `src/pages`；分包页面 `src/subpackages`；状态 `src/stores`（user / dict / notice / root / theme / setting 六个）。
- 路由守卫 `src/router/router.ts`（基于 sard-uniapp Router 的前置守卫；公开白名单在 `src/constants/public-routes.ts`，`isPublicRoute()` 支持 url 带 query）。
- 根级应用逻辑：`src/App.vue`（onLaunch 初始化主题 + 注册 WebSocket 通知监听）与 `src/AppRoot.vue`（承载 uni-ku/root 根节点能力，挂载 sar-notify-agent、sar-dialog-agent、sar-crop-image-agent 和轻量通知组件）。
- 关键组件：`src/components/captcha`（验证码）、`src/components/refresh-content`（下拉刷新/上拉加载一体，3 文件 + 依赖 `src/components/app-loading/index.vue` 与 `src/utils/haptic.ts`；app-loading 走 pages.json easycom `^app-loading$` 规则）、`src/components/mp-html`（手工 vendored 富文本）。
- 平台差异归一层：`src/utils/attachment/`（域入口 attachment-utils.ts + platform/h5.ts / app.ts / mp.ts）。
- 图标：sard 内置 sari 族 + 业务字体 `src/static/icons/icon.css`（antd 风格描边，族名 `icon`）+ `custom.css`。
- 类型声明分工：`src/shime-uni.d.ts`（模块身份的 vue 增强）与 `src/env.d.ts`（全局脚本环境声明），见「版本与环境基线」。

## 核心规则

1. API 函数放 `src/api/<domain>/<feature>/`，类型放对应 `type/`；每个后端交互定义为导出函数，走 `@/utils/request` 统一封装（存在 token 时附加 bearer auth，统一处理登录过期等响应码）；HTTP 方法必须与后端一致（部分文件使用大写 `GET`/`POST`/`DELETE`，按相邻文件风格书写）。
2. App 专用接口用 `app/system/profile` 这类前缀；除非后端明确允许复用，不调用管理端接口。api url 写完整相对路径（含 `app/` 前缀），request 层不统一拼接业务前缀——脚手架供二次开发，不把「接口必须以 app/ 开头」做成强制约束。
3. 所有可跳转页面必须在 `src/pages.json` 注册；tabBar、首屏和公共页面放 `src/pages`，业务功能页放 `src/subpackages/<domain>/...`（避免主包体积增长），只服务当前模块的组件放对应分包内，全局复用的移动端组件放 `src/components`。
4. 需要经过路由守卫的跳转应 `import router from '@/router/router'` 再调 `router.navigateTo`/`router.redirectTo` 等，勿直接用 `uni.navigateTo`；webview 类跳转需对 URL 参数编码；路由守卫维护匿名白名单（splash、登录、注册、隐私政策、用户协议），新增公开页要谨慎加入并同步检查白名单。
5. 新增 UI 前先复用 Sard UI 和项目已有组件；字典值用 App 字典工具和 `dict-tag` 组件（TypeScript 中字典选项 ref 需要 `.value`）；附件用现有附件上传组件和附件工具；通知类能力用 notice store 和通知组件；主题行为与 `src/stores/theme.ts` 和 pages.json 主题变量保持一致。
6. 页面状态组织用 init 工厂模式：一个子业务一个 `initXxx()` 工厂（状态 ref、方法、watch 收进工厂，`return` 导出，setup 顶层解构消费；同一业务的多个操作合并一个工厂；有状态的业务必须 init，无状态简单操作同样按 init 组织）。**app 特有差异**：生命周期钩子（onShow/onLoad 等）不进工厂、留 setup 顶层引用工厂产物（工厂内无生命周期注册先例）；只读常量也留工厂外，工厂只收状态与逻辑。样板：`AccountDeactivate.vue`（initPasswordCheck / initDeactivate）、设置页 `initAppUpdate()`。
7. 系统设置开关统一从 `stores/setting.ts` 取（`useSettingStore`，与 web 同构：enableCaptcha 默认 true / enableSignUp 默认 false，`initBaseSetting()` 一次拉齐）——登录/注册页进入时调用，页面用 `computed(() => settingStore.xxx)` 读，勿再页面间 URL 透传或各自调 API。
8. 公共样式类必须页面级 `@import`：组件级引入的公共类在小程序样式隔离下穿不进孙组件——新页面涉及嵌套组件消费公共样式类时一律在页面 style 引入。
9. **没有特殊样式需求不手写 CSS**：样式优先用 sard 组件能力与项目既有样式类表达；手写 CSS 仅限复杂选择器、伪元素、keyframes、运行时动态值等必要场景。
10. **优先 sard 组件，优先库自身的 props/events/slots**——能用库能力的不自造（自绘控件、手拼 class 复刻库 DOM 都是破窗）；确需覆盖组件库样式时**先向用户提出确认**，不擅自覆盖（sard 官方覆盖通道是 root-class / root-style，注意小程序端 root-class 会被 scoped 断开的已知坑）。
11. **保持风格统一**：新 UI 落笔前先找同类页面/组件先例，照其结构、交互形态与样式写法，不引入第二套风格。
12. **自定义组件必须对齐主题体系**：色值/圆角/间距消费 sard 的 `--sar-*` CSS 变量（亮暗自动跟随）与页面级 CSS 变量双值 + `.theme-dark` 覆写（暗色桥接见「主题与暗色」节），禁止硬编码色值。

## 二开边界

- **页面归属**：平台自有页面勿混入二开业务——主包 pages（splash/登录/注册等）、tabBar（首页/个人中心，平台结构勿增删）、平台分包 `subpackages/system`（通知/设置/协议/演示样板）。二开业务建自己的分包 root `subpackages/<业务域>/` 并在 `pages.json` 增量登记（注意键名是驼峰 `subPackages`）；主包只进 tabBar/首屏/公共页。
- **脚手架配置契约**：`manifest.json`（h5 darkmode/themeLocation 等）、`pages.json` 平台配置段（tabBar/easycom 规则）、`theme.json` 是脚手架契约，用而不改、改动前与用户确认；改 manifest 必须重启 dev server（启动期缓存）。
- **接口契约**：二开新接口在后端仓 `controller/app` 落位（`app/...` 前缀，细则见后端仓 skill），App 侧按核心规则 1-2 的目录与封装约定消费，字段与后端 DTO/VO 对齐。
- **静态资源**：主包 `static/` 只放全局必需资产（图标字体、通知横幅、主题图等）；业务资源随分包放置，控制主包体积。

## 请求、上传与附件

- 请求层仅 401/451 自动 toast（505、非 200 状态码、网络异常均静默抛 ResponseError），吞错点统一用 `utils/toast.ts` 的 `toastRequestError(err)`（跳过 401/451 防双弹，兜底 toast msg）。**request 401 在登录页不走 authenticationFailure**（凭据错误与会话失效共用 401；登录页上重登 reLaunch 会重建页面、记住账号回填冲掉用户已输入的账号密码，仅 toast）——非登录页行为不变。
- 上传超时独立于普通请求：`attachmentUpload` 默认 60s（`RequestConfig.timeout` 逐请求覆盖实例默认值，sard 的 mergeConfig 为 spread 合并）；调用方可再传 `timeout` 覆盖。
- `uni.uploadFile` 的 `formData` 值必须是字符串：可选字段须条件拼入（undefined 会被序列化为 `"undefined"` 发给后端）；JSON body（`data`）则由 JSON.stringify 自动丢弃 undefined。
- **上传 Content-Type 平台契约**：multipart 头在 H5 **不得手动声明**——uni-h5 用 XHR 发 FormData，手动设 `multipart/form-data`（无 boundary）或被拦截器改写成 `application/json` 都会让后端不启用 multipart 解析，**全部表单字段与文件绑定失败**；H5 必须让浏览器自动生成含 boundary 的头。`request.ts` 拦截器对 `method === 'UPLOAD'` 跳过默认 json 头；上传头一律从 attachment 域入口的 `getUploadHeader()` 取（app/mp 返回手动 multipart 声明，原生实现自行组装 boundary）。
- **附件访问链单字段契约**：后端下发前已把附件访问链（`/system/attachment/storage/download?fullPath=` 公开链或 `?key=` 签名链）填进 `url`/`path` 字段（profile/info 的 avatar value 也经 processAvatarUrl 换算）——前端不拼对象键，统一用 `resolveAttachmentEntryUrl(entryUrl)`（`@/api/system/attachment/attachment-storage`：`http(s)://` 开头直用，否则 `VITE_APP_BASE_API + '/app' + entryUrl`——App 走 /app 网关前缀，与 web 同名 helper 的唯一差异）。上传响应是 `AttachmentUploadVO`（id 供 v-model、path 为对象键、url 为首次访问链），v-model 持久化 id；头像 JSON 的 value 存 VO.path 对象键。`exists` 是 `GET exists/{md5}`（md5-only）；upload 的 DTO 无 md5/uploadMode、fastUpload 无 size/uploadMode（不要传死参数）。
- 附件状态字典（后端 AttachmentStatusEnum，常量 `ATTACHMENT_STATUS` 在 `api/system/attachment/type/sys-attachment.ts`）：`0` 成功 / `1` 失败（info 查询未命中回填的占位行也是 1）/ `2` 分片上传中 / `3` 业务删除——前端判断失败态用 `=== ATTACHMENT_STATUS.FAIL`，勿写 `'error'` 之类字符串。

## WebSocket 与通知

- **WS 重连形态**（与 web 终态对齐）：固定 2s 间隔 × 3 次上限后停止自动重连；onError 仅日志（防 error+close 双触发重复重连）；异常断开由 onClose 的 `code !== 1000 && enableRetry` 判定（uni 的 onClose 回调参数无类型化 code 字段，部分平台 undefined——按异常倾向重连，主动关闭由 enableRetry 拦截）；connect 入口复位 enableRetry、closeConnect 清零 retryNumber；getOnceToken 失败与 connect 异常均纳入重连。
- **重连耗尽后的外部恢复通道** `manualReconnect()`（连接存续忽略 + 清零额度重启）：`web-socket.ts` 模块级 `wsStatus` ref 三态侧写与 web 同构（connected/reconnecting/disconnected；写入点 connect 入口/onOpen/重连耗尽分支，closeConnect 不改状态）；Profile 铃铛左侧重连钮**非连接态渲染**（disconnected=可点图标，reconnecting=旋转 loading；点击仅 disconnected 响应并 toast，连上后按钮随 v-if 隐藏；旋转动画用 root-class + scoped keyframes——Vue3 子组件根节点继承父 scope attr 故 scoped 选择器可命中）。
- **通知红点唯一值驱动**：`App.vue` 的 `watch(unreadCount)`（值变化时设置）+ `AppRoot.vue` 的 `onShow`（切回页面时重设；非 tabbar 页 uni.showTabBarRedDot 会静默 fail 属预期）——其余调用点不要手动 `setTabbarRedDot()`；`getUnreadCount` 内聚容错（失败保持现值不抛错）；红点挂在个人中心 tab（`NOTICE_TAB_INDEX = 1`）。

## 登录注册页（参考存档，非强制约定）

> 本节是**个人设计偏好存档**，不作为项目强制约定：页面交互形态（键盘/caret/提示行/弹窗排布等）是作者个人的设计取向——改动此页面前先与用户确认，保持现有体验即可。

- **键盘与输入框机制**：键盘弹起时页面整体 translateY(-30%) 上移（禁用页面滚动），期间聚焦输入框 caret 会错位——APP 端 `.auth-item` 默认 `caret-color: transparent`，**上移完成后光标才淡入**（`.auth-item.show-caret` 的 caret-color 过渡带 delay，delay 必须等于 `.auth-content` transform 时长，收起方向仍即时淡出）。逻辑在 `src/pages/login/use-keyboard-status.ts`（页面同目录 composable）；两页只保留模板绑定（`:style` transform / `:class` show-caret）与跳转前手动 `openKeyboard.value = false`；auth.scss 既有规则为现状基线，改动时保持现有体验。
- **提示行互斥单槽**：外层 `.tip-slot` 定高 `var(--sar-button-height)` 并 flex 垂直居中，内部 `v-if 断连 / v-else-if 注册` 两分支，皆隐藏时保留空槽——任何状态切换零位移；勿改回双独立 v-if、勿加 v-else 不可见占位文本。
- **协议确认弹窗排序坑**：APP 端 sard 弹窗不 teleport、内联渲染在模板书写位置——sar-dialog 若排在 `<Captcha>`（fixed 全屏弹层组件）**之后**，同意续跑的同一渲染周期里验证码弹层挂载后其 `#bg` 节点 `boundingClientRect` 量测返回 null → 原生回调内 TypeError 绕过 try/catch，验证码冻死；排在 Captcha **之前**则一切正常。**约定：弹层组件一律排在 fixed 全屏组件之前**（Login.vue 弹窗处已留注释）。协议弹窗逻辑本身无时机限制（同意后 `pendingProtocolAction` 立即续跑）；样式 `.protocol-dialog-*` 放页面 style 顶层。
- **守卫预热模式**：守卫对 `initUserInfo()` 采用乐观放行（不 await 不阻断导航，登录态异常由 request 401 拦截器兜底登出）；`initUserInfo` 用模块级 promise 在途去重（并发导航复用同一请求，终态清除允许失败后重试）。
- **登录后信息补全向导**：契约 `GET app/system/profile/postLoginCheck`（双后端同构转发，值域三组件名字符串、策略 @Order 固定顺序）+ `GET app/system/user/checkPhoneNumber|checkEmail`（动词对齐 web；既有 checkUserName 保持 POST）。App 链路：Login 成功后调 postLoginCheck——空数组走原首页路径零变化；非空经 `helpers/user-setup.ts` 暂存（storage key `lihua_post_login_check_data`，逐项剔除、全清兜底）后进向导——APP 端 `navigateTo` + `animationType:"slide-in-bottom"` 底部滑入（登录页留栈底）、微信端 `reLaunch` 清栈（栈唯一，安卓物理返回=退出小程序）。**校验失败回滚 removeToken 留登录页**（登录原子性；fail-open 进首页已被否决——后端断点时超时会跳过补全）。向导 `pages/user-setup/UserSetup` + 五步组件（欢迎/重置密码/基础信息/默认部门/完成，共享 `static/style/user-setup.scss`，不抽公共壳组件）：swiper `disable-touch` 按钮驱动；**防绕过四件套** = disable-touch（防手势滑过）+ `onBackPress(()=>true)`（App 物理键/侧滑；**微信端 onBackPress 不触发**）+ pages.json 该页 `disableSwipeBack:true`（微信 iOS 侧滑）+ 路由守卫暂存非空且目标非向导页则拉回（杀 App 重启/直开任意页兜底；守卫同时短路向导期 WS/红点/字典懒加载——**向导完成时必须补齐 connect/getUnreadCount/initDict**，因守卫只在 userId 为空时做这些，向导已提前 initUserInfo，完成后进首页会漏初始化）。默认部门步「以后再说」仅**未设过默认部门时显示**；改密双入口（向导重置密码步 + SavePassword 页）都同步 `updateRememberedPassword`（`helpers/remember.ts`，仅 rememberMe 开启时覆写、不刷新 30 天窗）。

## 主题与暗色

- **暗色判定一律取 `stores/theme.ts` 的 `isDark` getter**（mode 强制值优先；auto 时用 systemTheme——App.vue onLaunch 挂 `uni.onThemeChange` 同步；`getSystemInfoSync().theme` 在类型里是 string，需 `=== 'dark'` 显比较收窄）。需要暗色样式的页面/组件在自己根节点绑 `:class="{ 'theme-dark': themeStore.isDark }"`，页面 style 内定义 CSS 变量双值（亮色默认 + `.theme-dark` 覆写）消费——**勿在业务页面用 `@media (prefers-color-scheme)`**（与 store 脱节，App 内 setUIStyle 强制切换时页面不跟随；sard 组件库暗色变量用媒体查询是组件库全局机制，不冲突）；不依赖 AppRoot 祖先 class / `:global()`（小程序端跨组件选择器有兼容风险），每个消费方自绑。
- **主题手动切换仅 APP（H5 不支持，勿再提议）**：sard 的 theme-dark mixin 焊死 `@media (prefers-color-scheme: dark)` 作用于 page/.sar-portal，无 class 切换口且浏览器不允许覆盖媒体查询——H5 强制切换必致 sard 组件保持系统色、业务页面变暗的混色花屏；H5 靠 auto 跟随系统（浏览器原生完整体验）。
- **H5 暗色机制**：①manifest `h5` 节的 `darkmode:true + themeLocation` 是总开关——不开时构建器把 pages.json 的 `@变量` 静态解析成亮色写死（navbar/tabBar/页面 chrome 永远亮色）；开了后 uni-h5 运行时按 `prefers-color-scheme` 解析 theme.json。**改 manifest 必须重启 dev server**（启动期缓存）。②`page { color: var(--sar-body-color) }`（App.vue 全局）：输入框值文字等无组件级变量、不设色时默认黑——亮色恰好正确、暗色全黑（机制不分端，APP 暗色同患同治）。③`page { min-height:100% }`：H5 的 page 高度随内容自适应，短内容页背景盖不满视口露白；html/body 画布（overscroll 回弹区/首屏白屏期）sard 变量取不到，App.vue 内 `#ifdef H5` 按 theme.json 的 bgColorTop/Bottom 硬编码双值媒体查询——**改 theme.json 基线色须同步该处**。④H5 favicon 用 `public/favicon.png` + index.html link（vite 原生目录仅进 H5 构建）；uni-h5 按当前页动态更新标签页标题。
- **明暗双资源切换**：用 `uni.getSystemInfoSync().theme + uni.onThemeChange` 动态切 src（单节点，auto 偏好下取系统实际值；未开启 darkmode 的平台 theme 为 undefined 按亮色兜底）——首页 logo 亮暗双图是样板；勿用双节点 CSS media query 方案（root-class 隐藏在部分场景不生效会并排）。
- **Profile hero 背景与 web 登录页同源**：色板取 web `login/components/LoginBackground.vue` 的 noon（亮）/night（暗）双套**静态**版（无时段切换无动画）；结构为「上二天球下四海球」4 个 radial-gradient 柔边光 + 斜光带 + 基色线性渐变六层；沿用 `--hero-bg`/`--hero-mask` 双变量骨架 + `::after` 蒙层；基色渐变 0% 端必须锚定页面底色（亮 `#f7f7f8`/暗 `#000000`，与 `--sar-body-bg` 一致）保证下部融入。**光球必须用 `circle <px>` 半径**（位置仍用 %）——% 椭圆双轴在矮宽 hero 上各自取宽/高百分比会把光球横向拉长成条，px 半径任意屏宽恒正圆。**暗色光球 alpha 必须折减（约减半）**：web 色板 alpha 是 blur(90px) 前的强度，无 blur 的 radial-gradient 直接沿用会放大 2-3 倍成高饱和色块（亮色 orb 本身浅可不折）；暗色层渐变端点用同色 `rgba(r,g,b,0)` 而非 `transparent`（后者向黑色插值在深底出灰暗脏边）。**终态契约：暗色与亮色同几何（半径/位置/止点逐球一致），仅换暗色板颜色 + alpha 折减**——放大半径模拟 blur 柔感已被否决（hero 矮宽区域光球放大必重叠）。头像行 `absolute bottom: 48rpx` 锚定底部（背景再撑高头像不上浮）；铃铛独立 `absolute` 钉右上，`top` 条件编译：小程序 `calc(10vh + 80rpx)` 避开原生胶囊按钮、其余平台 `10vh`（样式内 `/* #ifdef MP */` 写法）；层序 `::after` 蒙层 z-index:1 < 头像行/铃铛 z-index:2。**双端改色需同步**：动 web 登录色板或 App hero 色板任一侧时同步另一侧。

## 图标体系

- 两类来源：① sard 内置 **sari 族**（`<sar-icon name="check"/>` 默认 family）；② 业务字体 `static/icons/icon.css` **全量 antd 风格描边图标**（iconfont 平台原生导出；族名 `icon` + 类前缀 `.icon-`——通用、不绑项目品牌、无连字符）+ `custom.css`。使用形态：`<sar-icon family="icon" name="XxxOutlined"/>`。
- **字体生效三件套**（icon.css 内，改名/替换时三者必须齐改）：① `@font-face { font-family: "icon" }`；② 图标类前缀 `.icon-XxxOutlined:before`；③ **字体基类 `.icon { font-family: "icon" !important }`**——sard 图标元素靠 family 名拼进根 class 后由该基类命中应用字体，漏③元素拿不到字体渲染成豆腐块。仅静态业务使用，**不提供图标头像**（Web 端设置的 icon 头像在 App 端由 user-avatar 退化为默认头像，不渲染图标名文本）；通知 icon 值域仅 Message/Notification 两种（Web 端按类型写死）；原生推送横幅用 `static/notice/*.png`。
- **新增图标流程**：iconfont.cn 项目内增补 → 导出 TTF Base64 css → 整体替换 `icon.css`（注意把导出的 font-family/类前缀改回本处约定的 `icon`/`.icon-`）。**图标字体一律平台导出，不做本地子集化**——fonttools 本地子集即使保守参数浏览器渲染通过，真机 webview 仍 tofu（浏览器验证 ≠ 真机可用）。

## 组件契约与坑位

- **sard 组件样式覆盖三连坑（小程序端实证）**：①页面 scoped 样式只能命中 sard 组件的**根节点**（Vue 子组件根继承父 scope attr——WS 重连钮的 ws-spin 旋转即根节点 scoped keyframes 先例），**组件内部节点命中不了**——覆盖内部样式用 `:deep()` 或全局样式层；②`root-style` 挂在原生 button 等内置元素上不生效；③页面级 keyframes 动画对组件内部节点不生效。覆盖 sard 样式属「覆盖组件库样式先问用户」范畴（核心规则 10）。
- **captcha（`src/components/captcha/index.vue`）**：已落地的修复勿回退：四处 `boundingClientRect` 回调补 `data &&` 判空（查不到节点回调收 null，`!Array.isArray` 拦不住）、`getCaptcha` 补非 200 分支、`end` 修 `||` 优先级、CONCAT `randomY` 与点选坐标零值改 `!= null`、默认 process 改工厂函数、成功/失败 `setTimeout` 存句柄并在 `refresh`/`onUnmounted` 清理、**校验提交到下次刷新间以 `.verify-freeze` 透明阻断层盖住游戏区锁交互**（`verifying` 置位于提交、`refresh` 解除；纯 JS 处理器 return 挡不住 movable-view 原生拖动，须物理拦截）。`$scope` 相关用 unknown/本地类型收敛；标识符改名须全文件同步（外部仅按路径 import 组件不引用内部名）；暗色块由 `.verify-wrap.theme-dark` class 驱动（接 isDark 桥接，不用媒体查询）。**滑动行程坐标系契约（ROTATE 对齐官方 TAC 客户端）**：后端校验 `(轨迹末x−首x)/bgImageWidth` 对 `randomX/600`，ROTATE 的 randomX∈[210,590)、容差 0.03；前端必须**三处同分母**——① `end` = 背景宽 − **按钮实宽 80rpx**（`.block-button` 改尺寸须同步 `uni.upx2px(80)`），使物理行程=满量程；② 显示角 `moveX/end×360`；③ **ROTATE 提交时把 bgImageWidth 字段改写为 end**（其他类型保持背景宽，绝对定位语义）——任一处错位都会「视觉重合≠校验通过」甚至无解。SLIDER/CONCAT randomX 上限 479rpx < 行程，安全。
- **refresh-content（页面级下拉刷新+上拉加载一体）**：自绘触摸 + renderjs 同步 preventDefault + mescroll 兼容 API。**消费硬前提**：页面级滚动（不套 scroll-view/不写死高度）、不开 `enablePullDownRefresh`、页面根 **`height:100vh`** 文档地板（**勿用 min-height**：组件根 `min-height:100%` 需父级确定高度才解析，min-height 之父会令其退化为 0——列表不满屏时下方空白区域在组件根外、无下拉手势）、每页仅一实例、自定义导航栏传 `:top`；请求结束必须回调 `mescroll.endSuccess(dataSize, hasNext)`/`endErr()`；用法样板在演示页 `subpackages/system/components/pull-refresh/index.vue`。**侧滑锁定契约**：凡是用 RefreshContent + `sar-swipe-action` 的列表页（页面级 body 滚动），必须给 `<sar-swipe-action-group>` 加 `root-class="... ptr-swipe-lock"`——sar-swipe-action 自身的 preventDefault 跑在逻辑层（跨 JS bridge）来不及阻止原生纵向滚动，renderjs 会在视图层同步判定横向手势（|deltaX| > 6px 且 ≥ |deltaY|）并 preventDefault 锁定纵向滚动和 iOS 橡皮筋；仅在加标记的区域生效；更广结论：App 端 body 滚动页面的手势锁定，可靠方案只有 renderjs 视图层同步 preventDefault（`:scroll-y="false"`、page-meta、touch-action 都不可靠）。**renderjs 模板绑定类型坑**：`:change:prop="renderBiz.propObserver"` 里的模块名 vue-tsc 无法从 `<script module lang="renderjs">` 推导——解法是 `src/shime-uni.d.ts` 以模块身份 `declare module 'vue'` 增强 `ComponentCustomProperties`（**该文件必须有 `import 'vue'` + `export {}` 保持模块身份，否则变成重声明遮蔽 vue 真实类型**——曾致全仓 onMounted 等报错，勿写进 env.d.ts 等全局脚本文件）。
- **message-notify（全局消息通知，仅 APP-PLUS）**：`plus.nativeObj.View` 原生绘制层无 CSS——**投影用 alpha 阴影床 PNG 模拟**（阴影床内挖空透明卡片区）；View 取原图中段适配视口，bitmap 按「View 代表的图内中段宽」定比**自然缩放不拉伸**（按卡片区宽或整图定比都会失衡/横向拉伸——两个已修坑）；实色卡片 drawRect 且左右各外扩盖住挖空边缘抗锯齿暗边与原生取整露边；**调边距只改 sideCrop 一个常量**（须同步 resolveLayout 设计稿常量）；亮暗各一张随主题换图；左侧图标直接 drawBitmap，**资产必须自带 alpha 轮廓**（原生层无圆角裁剪，无 alpha 方图四角露底；遮罩/描边 hack 不可行）；`NotifyContent.maxWidth` 可指定可见横幅宽上限（缺省 440 平板限宽）；布局每次 show 前 `refreshLayout()` 重算（windowWidth、横屏安全）；动画 opacity 钳制、duration 每次 show 重置。
- **mp-html**：手工 vendored（`src/components/mp-html/`），**保持与上游逐字一致，不做任何本地修改**（含死分支也不删——便于 diff 对照与随上游升级）；已排查无致命 bug；消费方仅通知 Detail 与 notice-lite，真机回归富文本渲染须覆盖。
- **sar-popout 的 `before-close` 语义**：返回 pending promise 时对应按钮自动 loading——**resolve 关闭、reject 阻止关闭**（保存失败保持抽屉打开用 reject + toast，SaveAvatar `handleSave` 是样板）；在组件外直调该函数需自行 `.catch(() => undefined)` 吞 reject 防 unhandled rejection。
- **用户取消走 fail 回调**：`uni.chooseImage` / sard `cropImage` 等——App 端 errMsg 仅 `"chooseImage:fail"` 无 cancel 标识、各平台不一致，不能按文案区分取消与失败；用户可取消的原生流程 await 外层包 try/catch，catch 静默 return（SaveAvatar `chooseImage` 是样板）。
- **个人中心「修改单项基础信息」三页**（SaveNickname/SaveEmail/SavePhoneNumber）：保留各自独立实现，不抽公共 composable/通用页（已抽过被退回——三页重复可接受，抽公共层反增理解成本）；新增同类字段页直接复制现有页面改字段/校验；已知小坑：toast 文案别写错字段名、手机号页 maxlength 应为 11。
- **常量唯一源**：头像文本色板 `src/constants/avatar-colors.ts`；项目仓库地址 `src/constants/repo.ts`。

## 跨平台归一层（域入口 + platform/ 伴随文件）

同一能力各平台实现不同时（**实现差异类**）收敛为：域入口文件（如 `utils/attachment/attachment-utils.ts`）承载通用逻辑（空参守卫/fileName 截取/结果组装）+ `import * as h5/app/mp` 命名空间引入 + 每能力约 3 行 `#ifdef` 分发（**域内唯一 #ifdef 点**）；平台实现进域内 `platform/` 子文件夹（`platform/h5.ts`/`app.ts`/`mp.ts`，域根只留主文件与类型），文件内只放平台原语：完整函数、**同签名同名导出**（某平台缺导出会被入口的 import 即时暴露，契约对称免约定维持）、顶层零副作用零平台 API 调用（差异只许在函数体内）、显式标注共享返回类型。业务与组件只 import 域入口，不直接引用 platform/ 文件。入口对三文件**无条件 import**（生产构建剥离 #ifdef 后未引用的平台函数被 tree-shake，近零体积成本）。**TS 已知坑**：`#ifdef` 互斥分支对 vue-tsc 均可见，守卫后的参数收窄在后续分支不保持——守卫后 `const path: string = filePath` 固化再分发。**分类边界**：特性守卫类（haptic、theme.setMode、message-notify 等 APP-only 入口）原地 `#ifdef` 不进此结构；CSS 与 renderjs 的条件编译是 uni 标准用法不适用；vendored（mp-html）不动；游离全局 util（client.ts 的 getClientType 三常量）原地。审计点：`find src -type d -name platform` 列出全部分叉域。

## 版本与环境基线

**版本约束**（具体版本以 package.json 为准，此处记原因）：
- `@dcloudio/*` 全家桶与 HBuilderX 版本严格配对（50206 构建 ↔ HBX 5.26）；升级直接改 package.json 版本号 + `npm install`，不用交互式 uvm（非交互环境会卡选择，且会顺手写入多余的 rollup pin）。
- `vite` 钉 5.2.8：uniapp 最新 vite-plugin-uni 的 peer 精确要求，不可升。
- `sass` 钉 1.69.7：sard-uniapp 官方建议 ≤1.69.7；vite.config 已配 `silenceDeprecations` 兜底。
- `rollup` 是 vite 的传递依赖，**不可降**：低版本与 HBX 真机 dev 链路冲突（`Failed to convert napi value into rust type bool`）。若 uvm 或其他工具写入了 rollup pin，删除后 `npm update rollup` 恢复。
- `@dcloudio/*` 包即使源码零引用也不删（uniapp 生态有隐式依赖，如 uni-stacktracey 供真机错误堆栈 sourcemap 还原）。

**已确立写法**：
- TS 6 + vue-tsc 3.3 下编译器宏（defineProps/withDefaults）不得显式 import；props 默认值用 Vue 3.5 响应式解构：`const { size = 128 } = defineProps<{ size?: number }>()`。
- tsconfig 不配 baseUrl（TS 6 废弃、TS 7 移除）；`paths` 相对 tsconfig 所在目录解析。
- 唯一 ID 用 `src/utils/uuid/uuid.ts` 手写实现（时间戳+进程序号+随机数，无 npm 依赖）；调用方 web-socket.ts 的 clientId。
- TS 6 + vue-tsc 下**闭包内赋值的 let 变量在回调调用后真值收窄不可靠**（`if (dict)` 后 spread 仍报错）——遍历查找类逻辑直接把命中处理写进回调体内用局部 const，别用「闭包赋值 + 外层 if 守卫」结构。
- **src 根声明文件布局**：`shime-uni.d.ts` = 模块身份的 vue 增强（uni Hooks 的 ComponentCustomOptions + renderjs 的 ComponentCustomProperties.renderBiz，`import 'vue'` + `export {}` 保持模块身份）；`env.d.ts` = 全局脚本环境声明（ImportMetaEnv、*.vue 通配、无类型包简写 `declare module 'x';`）——**两者不可互并**：模块身份文件中简写环境模块声明与 `export = any` 均不生效（对已存在 npm 包的 declare module 被当作模块扩充），简写声明必须住全局脚本文件。

## 红线与已否决方案

- refresh-content 页面根不用 min-height（组件根 `min-height:100%` 需父级确定高度才解析，min-height 之父会令其退化为 0——列表不满屏时下方空白区域在组件根外、无下拉手势；属公共组件用法特别提醒，细则见「组件契约与坑位」节）。

## 环境与验证

- 验证：`npm run type-check`（TypeScript/Vue 正确性）；H5 验证用 `npm run dev:h5` / `npm run build:h5`；只有功能目标包含对应平台时，才运行 `dev:mp-weixin`、`build:mp-weixin` 等平台脚本。
- **AI 侧验证边界**：AI 以 type-check/构建/静态检查为界——页面视觉与交互（触摸手势、键盘、横竖屏、平台差异行为）AI 无法验证，由用户真机回归；涉及交互的改动在汇报时列出人工回归点。
- **项目内 npm 永不 sudo**——root 属主文件会导致后续所有 install EACCES；已发生则 `sudo chown -R yukino:staff node_modules ~/.npm` 修复。
- 依赖升级后必须真机冒烟：HBuilderX 真机运行走独立 dev 链路（rollup 原生绑定等），CLI build 全绿不代表真机能跑。
- HBuilderX 升级后编译异常优先考虑重装 HBX（曾因升级安装损坏持续报 napi 错，重装即愈）。
- `node_modules/@dcloudio/.uni-*` 是编译器临时目录，npm install 被 EACCES 挡时可先清掉。
- macOS 大小写不敏感文件系统会掩盖 git 索引与磁盘文件名的大小写漂移；import 路径一律小写；发现 `git status` 显示意外大小写时，用两步 `git mv`（先改临时名再改目标名）修正，改后跑 type-check。
