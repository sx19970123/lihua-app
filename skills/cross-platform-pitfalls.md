---
name: cross-platform-pitfalls
description: 指导 lihua-app（uni-app x 蒸汽版）跨端（App-iOS/Android/Harmony、Web/H5、微信小程序）开发的实证坑点清单与统一标准。适用于：写/调多端不一致的样式与布局（行高/min-height/text 行盒/图标行盒）、元素量测、动画与手势的跨端表现、诊断两端差异（对数法）。每条均为真机实证，附定案口径与替代写法。
---

# 跨端坑点与统一标准（App / Web / 微信小程序，全部真机实证）

多端一致性是硬前置（拍板：多端一致后才继续后续开发）。本清单只收**跨端表现分叉的
实证坑**与对应的统一写法，单端 bug 不入。排查新差异先读本文，写新组件时遵守统一
标准节。行高/样式细则与 create-component.md 互引。

## 统一标准（写码前先背）

1. **行高=padding 直构**：上下 padding×2 + 文字行高，两端恒等一种账。禁 min-height
   抬行（语义分叉见坑①），min-height 仅限无 padding 元素。
2. **量测一律 `getBoundingClientRectAsync()`**：同步版 MP 不存在（坑③）；App 端同步
   版另有布局屏障问题（坑④）。动态文案宽度优先字符估算，静止期量测才用真量。
3. **不依赖 flush 结果的逻辑不塞 nextTick**（坑⑤）：动画/补间启动放事件 handler 内
   同步起跑。
4. **图标/图形列容器钉 `height` + `overflow: visible`**（坑②⑥）：行盒权威不许交给
   字体默认行高。
5. 排查跨端差异用**对数法**（见文末），不猜样式规则。
6. **隐藏态不留贴边的被绘制元素**：收起/藏起用宽度 0（或不绘制），勿靠「平移出裁切区
   贴边」（坑⑨）。
7. **命令式写层不与 `:style` 载体共管一键**（坑⑩）：载体里有的键，常驻值须经载体落下。
8. **按序号取 v-for 元素引用时用序号 key**（坑⑪）：引用数组序是打补丁序，不是 DOM 序。
9. **触摸标识只判空、不比大小**（坑⑫）：跟踪中的触点标识用 `null` 表示没有，标识符可为
   任意整数（iOS Safari 为负数）。
10. **Web 端给 scroll-view 的滚动盒子加样式须穿透**（坑⑬）：`.组件类 :deep(.uni-scroll-view)`，
    放在 `#ifdef WEB` 内；写在组件类上的滚动盒子属性落空。
11. **滚动区内部的触摸移动，处理函数绑在滚动区内部**（坑⑭）：小程序的滚动区把内部
    touchmove 截住，外层（含 wxs）收不到；wxs 与逻辑层分层嵌套。

## 坑点清单

### ① min-height 的 box 语义分叉（2026-11-22 诊断卡实锤，最大坑）

- **App 端（iOS/Android 蒸汽）按 content 区计**：`min-height: 38px + padding 8×2`
  → 总高 54（min 与 padding 叠加）；**显式 `box-sizing: border-box` 无效**（与官方
  width 文档口径相悖，引擎方言）。max-height 未见此分叉（钳的是渲染终值，tree 行
  `max-height: 38` 两端恒 38 ✓）。
- **MP/Web 按 border-box**：min-height=总高下限，38 就是 38。
- 症状形态：「一端行比另一端高恰好 padding 之和」——每行差 16px、一屏差 2-3 行。
- **统一写法**：行高 padding 直构（16×2+22=54）；或 tree 式 max-height 钳制。
- 教训：本案曾连猜三轮（line-height 无单位/text 不认继承/icon 行盒）全打偏——
  line-height/icon 当时都无辜，**先量再猜**。

### ② MP 端 text 组件的 line-height 行为存疑 + 图标行盒撑高

- 微信经典坑（社区公认）：`<text>` 上直接写 line-height 可能不生效，要写外层 view
  靠继承；本项目双写（view+text）未能观察到确定效果——**未终审**（被坑①掩盖），
  最终以容器钉高绕开，不再依赖。
- **uni-icons 无显式行高时默认行盒撑高行**：24px 图标 App 默认行盒 ~36、MP ~26，
  两端不同且都超标——**容器 `height: 22px + overflow: visible` 钉死**（布局属性
  两端必生效，字形溢出渲染放行）。

### ③ MP 端 UniElement 无同步量测（getBoundingClientRect）

- 同步版直接 `TypeError: _a.getBoundingClientRect is not a function (in promise)`
  大量刷屏；金矿 mp/README 明示 MP 仅支持 `getBoundingClientRectAsync`。
- 全仓同步量测要清零（曾漏 segmented/captcha 两处——平台分叉时只防了 swipe）。

### ④ App 端同步量测=强制布局屏障（老安卓几十 ms）

- 换文（confirmLabel 等）后立即同步量测，要**等渲染线程完成重排才返回**——排队
  几十 ms 起步；估算（字符宽 CJK≈1em/其余≈0.55em×字号，MP 核同款）微秒级替代。
- 静止期量测（mounted 的 measure）保留真量测，精度优先。

### ⑤ nextTick=等组件更新 flush（老安卓常态 30-40ms、偶发 GC/背压数百 ms~秒级）

- 「估算/纯计算」类逻辑塞 nextTick 里=白等 flush。先问该逻辑**是否真依赖渲染结果**
  （量测依赖 → 估算化后不依赖 → 拆掉）。动画/补间启动同步起跑，文字换文晚一拍
  跟上可接受（主视觉先行）。
- 分段计时 log 定位法：click→赋值→属性写→flush→nextTick→首帧，哪段大修哪段。

### ⑥ hover-class 的 Android 双失效（2026-11-22 实锤）

- 按压周期中途把 hover-class 切 `'none'`：**既不刷新当前视觉**（官方语义=组件区域
  内移动不取消，release.md:1796）**又废掉 up 摘除**（up 读当前值判「无 hover 态」→
  down 时类永久残留）。iOS 端两样都正常（实现晚一代，属性变化即时反映）。
- **统一写法**：hover-class 恒定类名（亮暗双类字面量由 isDark 选）；滑动/滚动中自动
  抑制按压=组件自治触摸检测（>5px 判滑动）+ `app-pressed-none` 透明覆盖类（详规见
  create-component「按压反馈」节），仍勿中途切 hover-class 值。轻放即滑（<50ms）不亮=
  hover-start-time 防误显，非 bug。

### ⑦ 摘 transition 对在途动画的语义分叉（2026-11-22 实锤）

- `transition: none` 写入瞬间：**App 端已在途的 CSS 过渡免疫**（动画对象一经启动独立
  于 transition 属性，照播完）；**MP/Web 端立即终止**且属性瞬跳到已写目标值。
- 症状形态：同一份「setTransition(300) → 写 transform → 随即 setTransition(0)」
  链，App 端看到滑出动画、MP 端元素直接消失。
- **统一写法**：凡「先挂过渡写值、后又立刻由 JS 补间接管」的动画，过渡期的帧驱动
  一律并入补间回调（同帧同曲线），不把任何一段视觉托付给「即将被摘的 CSS 过渡」。

### ⑧ 跨层级 z-index 在 iOS 蒸汽端不生效（2026-11-25 用户真机反馈）

- 官方 z-index 文档写明「父级未建层叠上下文时，子元素可与叔辈比层序」，iOS 蒸汽端
  实测不成立：段位（static）内的内容层 `position: relative; z-index: 3` 仍被叔辈滑块
  （absolute，z-index 2）盖住——父级子树被当作整体按自身层序绘制。
- **统一写法**：需要互相压盖的层做成**同一个父级的直接子元素**，各自显式 z-index
  （先例=captcha 层级链；app-segmented=按压高亮 0 < 滑块 1 < 内容 2）。

### ⑨ 贴裁切边隐藏=小数宽度下露边（H5 实证，2026-11-26）

- **症状**：H5 侧滑行收起态，行缘露出一条彩带色发丝线；只有部分行露（同配置的行
  露法一致），App/小程序未见。
- **机理**：H5 文字实测宽是小数（系统回退字体下两字 30.6px），彩带宽随之成小数
  （62.6/125.2/187.8）。「平移正好自身宽度藏到 `overflow:hidden` 外」要求被绘制的边与
  裁切边在物理像素上重合，而两者各自吸附——2 倍屏下三档宽度换算物理像素的小数部分为
  .203/.406/.609，最宽一档吸附后边缘落进裁切区内 0.39 物理像素（截图像素实测露头
  ≈38%），另两档落在区外不露。小程序走字符估算（整数宽）不触发。
- **统一写法**：隐藏态不留贴着裁切边的被绘制元素——收起宽度归 0（先例=app-swipe-action
  彩带恒贴行缘、按进度长出），或位移留整像素余量；勿用「translateX(100%) 出裁切区」。

### ⑩ :style 载体的键会被重渲染贴回（H5 实证，2026-11-26）

- **症状**：命令式 `setProperty` 改写 `:style` 绑定里**已有的键**（如首帧藏外的
  `transform`）后，父组件一重渲染（列表删行、loading 切换）该键被打回载体旧值——
  999px 位移重新贴回，彩带整排停在行外（行能滑开、按钮区空白）。
- **机理**：重渲染按载体内容重贴样式；命令式写只改元素不改载体，两处不一致时载体赢。
  载体里**没有**的键（如逐帧写的 width）不受影响。
- **统一写法**：命令式写层不与 `:style` 载体共管同一个键。载体里出现过的键，其运行期
  常驻值必须经载体落下（app/鸿蒙/H5=载体+元素双写，MP=载体单通道，先例=
  app-swipe-action 适配器 `settle`）；逐帧驱动只用载体里没有的键。App 端是否同样回贴
  未单独验证——按「会回贴」防御即两端安全。

### ⑪ v-for 元素引用数组序≠DOM 序（H5 实证，2026-11-26）

- **症状**：按序号从 `ref` 数组取元素写样式/量测的组件，列表在前面或中间插入项后
  序号与元素错位——侧滑行按钮 2→3（新增项排最前）后三块彩带宽度互换。只在末尾追加
  不触发。
- **机理**：`ref` 数组按打补丁顺序收集——已有节点留在原位、新挂载节点追加在数组
  末尾，而 DOM 里新节点排在前面。MP 不受影响（模板按 `index` 取响应式载体，无引用
  数组）。
- **统一写法**：按序号取元素的 v-for 用**序号 key**（`:key="index"`，节点原地更新
  不搬运，引用数组序恒等 DOM 序；先例=app-swipe-action 彩带），或改走响应式 :style
  载体。

### ⑫ 触摸标识符可为负数——不能拿 -1 当「无触摸」（iOS Safari 真机实证，2026-11-27）

- **症状**：iPhone Safari 上抽屉按住拖不动——按下有反应、移动毫无反应；桌面浏览器
  正常。侧滑、分段器当时是同一写法，同样会中。
- **机理**：`Touch.identifier` 由系统分配、取值任意。WebKit（iOS）在进程启动时取一个
  随机 32 位数作起点逐次加 1 分配（`WKTouchEventsGestureRecognizer.mm`：
  `incrementingTouchIdentifier = arc4random()`），传到网页后按有符号整数解读为负数
  （真机上报 -792208359、-792208358…）。手势组件以 `-1` 表示「未跟踪」、用
  `< 0` / `>= 0` 判空，标识符为负时 `touchstart` 照常登记，之后每次 `touchmove` 都被
  当成未跟踪直接返回（真机上报形态：登记计数正常、移动计数为 0）。按源码推断，起点
  落在高位时整段会话都是负数，换一次启动才会变（本次实测的会话全程为负）。
- **范围**：桌面 Chromium 的标识符从 0 起递增，不受影响；安卓 Chrome、App 端未实测。
- **统一写法**：跟踪中的触点标识用可空类型（`number | null`，`null`=未跟踪），只做
  `== null` 判空，不做大小比较；匹配触点只用 `===`。判空后先存局部常量再传给要求
   `number` 的函数。先例=app-sheet / app-swipe-action / app-segmented。

### ⑬ Web 端 scroll-view 的根节点不滚动（Web 实证，2026-11-27）

- **症状**：给 scroll-view 的组件类写 `overscroll-behavior` 一类滚动盒子属性不生效；量根
  节点 `overflow` 为 visible。
- **机理**：本仓 Web 构建（VDOM 运行时）里 `<scroll-view>` 根元素只做布局，内建
  `div.uni-scroll-view` → `div.uni-scroll-view`（内联 overflow，真正滚动的一层）→
  `div.uni-scroll-view-content`。组件样式带作用域属性，直接写内层类名选不中。
- **统一写法**：`/* #ifdef WEB */ .组件类 :deep(.uni-scroll-view) { … } /* #endif */`，
  编译为 `.组件类[data-v-…] .uni-scroll-view`。先例=app-sheet：内容到边不带动页面用
  `overscroll-behavior: contain`（滚轮实测：规则关时内容到底后页面 420→1113，规则开不动）。
- 蒸汽版 Web 运行时（`uni-h5/dist-x-vapor`）根节点即滚动盒子，本仓 Web 构建未用它；
  日后若切到蒸汽版 Web，此写法落空须复核。

### ⑭ 小程序端滚动区截住内部的触摸移动（开发者工具自动化实测，2026-11-27，基础库 3.18.0）

- **症状**：绑在 scroll-view 外层（面板根、组件根）的 touchmove 处理——逻辑层 bind 与
  wxs 都算——对滚动区内部发起的触摸从不触发；touchstart、touchend 照常冒泡。滚动区
  自身节点上的绑定同样收不到。
- **实证**：逻辑层留痕序列为「按下 S、移动只有滚动事件 B、松手 E」；改绑到滚动区的直接
  子节点后每步移动都有收到。
- **影响**：靠 touchmove 的手势仲裁在小程序上此前从不生效（抽屉「内容在顶部时下拉带动
  面板」）。
- **统一写法**：需要滚动区内部触摸移动的处理，绑在滚动区内部的内容层上。同一元素上 wxs
  与逻辑层不能绑同一个事件：分两层嵌套，wxs 在外、逻辑层在内（wxs 返回 false 拦下时事件
  不再冒泡，逻辑层须在它内侧才收得到）。两端模板用条件编译注释把开始标签拆成两份，其余
  端结构不变。先例=app-sheet 小程序端内容层。

### ⑮ 小程序端在 uvue 里用 wxs 响应事件（开发者工具实测，2026-11-27）

- **写法**：`<!-- #ifdef MP-WEIXIN --><script src="./x.wxs" module="guard"
  lang="wxs"></script><!-- #endif -->` 放在 `</script>` 之后，模板按模块名绑定
  `@touchstart="guard.start"`。编译器按 `<script module>` 声明的模块名识别，编成
  `bindtouchstart="{{guard.start}}"`，脚本里不必有同名变量。
- **实测可用**：`event.instance` 与 `ownerInstance.selectComponent('.类名')` 的
  `getBoundingClientRect()` 同步返回且含滚动偏移（按下时量到的位置与真实滚动位置逐步
  一致）；`ownerInstance.getState()` 可存手势状态；`ownerInstance.callMethod('名', 参数)`
  调到组件 `defineExpose` 暴露的方法；`setStyle` 的键用连字符或单词形式生效。
- **未在自动化下验证**：`return false` 对页面滚动的实际拦截。自动化注入的触摸不受
  catch / preventDefault 约束（头部的 catchtouchmove 同样拦不住页面滚动），只能真机确认；
  官方文档口径是「返回 false 相当于同时调用了 stopPropagation 和 preventDefault」。
- wxs 须 ES5 语法；同一节点 wxs 与逻辑层不能绑同一事件（坑⑭）。

## 动效实现坑档案（Vapor / 微信 VDOM，captcha 2026-11 真机实测；鸿蒙版开发前必读）

先例=captcha 的滑切/高度动画（`components/captcha/captcha.uvue`）。各端实现形态：
App(iOS/Android Vapor)=静态 style 起点 + 滑入 keyframes 延后挂载 + 滑出 setProperty
直驱；微信(VDOM)=keyframes class 三态(mp-out/mp-in)；点选量测走挂载期缓存的页面/
组件实例 getElementById。通用动画规则（单属性过渡、forwards、重烘焙等）见
create-component.md「动画」节。

**Vapor 端（App 双端）**

1. `animation-fill-mode` 的 backwards/both 不支持（仅 forwards）——animation 插入节点
   会先闪一帧自然终态。插入型动画必须「自然态=动画起点」：静态 style 起点，或
   keyframes from 与自然态一致。
2. class 切换驱动的 transform transition 不可靠：常驻节点同 class 复挂不重触发动画
   （解法=双 class 交替 a/b 强制值变化）；新建节点 class 变化跳变/吞动画。
3. height/width 的 transition 三路全灭（class 挂载/:style 绑定/setProperty 直驱均不
   触发）；但 @keyframes 动画宽高 5.31+ 可行。
4. 安卓新建节点存在 transition 激活窗口：首绘后短窗内 setProperty 改值不触发过渡
   （iOS 无此窗；诊断实证 ref/起点/调用全正常仍不播）——动画一律走 keyframes class
   声明，不走「起点态+改值触发 transition」。
5. 动画 class 与数据赋值同帧挂载，首帧渲染拥塞（图片解码/分支切换）会吃掉动画前段
   →动画 class 延后挂载（nextTick+32ms 两帧）。**勿换 requestAnimationFrame**：
   uni.requestAnimationFrame 在 dialogPage 实测调用即炸流程（透明页零内容白屏无
   报错，机制未明），固定 timeout 是实测可用形态。
6. 父级活跃 animation 会吞子容器的 transition →高度动画与滑入串行，不在同一时间窗共存。
7. 动态绑定（:class/:style 三元）在安卓新节点首帧应用滞后，闪一帧自然态 →用静态
   style 属性（DOM 创建即生效）做起点锚。微信端 mp-in 的触发依赖该静态 style 属性
   存在（删除后微信动画消失，机制未明），两端模板保持共享勿拆。
8. transform 位移用显式 px（百分比基准不可靠）。captcha 关键常量：内容区 288、滑距
   288、卡片高 298（图形/加载）/136（POW）——图形内容实高 297，盒子小于内容会静默
   裁切（曾致轨道被裁 1px，勿改回 296）。

**微信小程序端（VDOM 渲染，与 Vapor 行为不同）**

9. 同分支 :key 重建 diff 不可靠（复用容器）：绑定值 out→in 跳变会被 transition 过渡
   成横穿卡片。滑切动画用 keyframes class 声明即播（mp-out/mp-in），与节点复用解耦。
   相位→class 映射语义勿翻转：idle（滑入完成态）必须沿用 mp-in——曾改为「非 in 即
   mp-out」致 idle 重播滑出动画=内容滑出后整卡白屏（小程序白屏第三案）。
10. pointer-events 在 WXSS 不生效；uni-icons 组件的 click 转发不可靠（点击挂外层 view）。
11. selectorQuery/uni.getElementById 在业务页可用，但 dialogPage 内查不到组件元素
    （实测 null）——量测走挂载期缓存的实例（getCurrentInstance 异步上下文返回 null，
    onMounted 缓存 ownerInstance/ownerPage）；非 dialogPage 宿主回退 selectorQuery。
12. height transition 在微信浏览器内核天然可用（POW↔图形高度动画白赚）。

**通用**

13. 滑距 288=内容区宽，裁切层（overflow hidden，padding 内缘）保证内容碰边即消失；
    层级（低→高）：卡片背景 < 切换 loading(z1) < 内容裁切层(z2) < freeze 阻断(z10)
    < 结果横条(z11) < 操作区(z20)。
14. POW 挖矿中刷新保持可用：stopJobs 取消标志在挖矿片间生效，无泄漏；慢平台真解法=
    分端配置（小程序端不配 POW，3.1.0 后台已支持）。
15. 鸿蒙（Vapor）预期缺口（未验证，届时逐条实测）：@keyframes 兼容表标 x（仅
    transition 可用）→keyframes 方案若不可用，回退方案=requestAnimationFrame 全端
    支持，JS 逐帧补间 setProperty；app-harmony 插件目录留白。

## 小程序端自动化实测注意事项（开发者工具自动化，2026-11-27 实测）

验证小程序端行为时用得到，踩过的坑都在这里，免得重走。

- **入口**：编译用 HBuilderV 的 cli（`~/.hbuilderv-alpha/extensions/dcloud.hbuilderx-uniapp-sdk-*/sdk.app/Contents/MacOS/cli`），
  `launch mp-weixin --project <工程路径> --compile true`（仅编译，约 10 秒）；开自动化用
  `<微信开发者工具>/Contents/MacOS/cli auto --project <unpackage/dist/dev/mp-weixin> --auto-port 9420`；
  连接用 npm 包 `miniprogram-automator` 的 `connect({ wsEndpoint })`。
- **选元素用 xpath**：`page.getElementByXpath("//*[@class='x']")` 能选到组件内部节点。`A >>> B`
  跨组件选择器在本版本工具里元素句柄全解析到页面根（量到的都是页面尺寸）。逻辑层
  `wx.createSelectorQuery()` 配 `>>>` 会把应用服务打挂（之后查询全部栈溢出或不回调、页面
  白屏），须 `cli close` 后重开。
- **页面滚动位置**：`page.scrollTop()` 在抽屉页恒为 0，改用逻辑层
  `wx.createSelectorQuery().selectViewport().scrollOffset()`。
- **触摸**：`element.touchstart / touchmove / touchend({ touches, changedTouches })` 是真实输入
  （会原生滚动），但以给定元素为事件目标——不做坐标命中，目标取外层节点时其子节点不在事件
  路径上；触摸点对象不自带 `screenX / screenY`，不下发就没有，别据此误判平台缺字段。注入的
  触摸不受 catch / preventDefault 约束，不能用来验证「拦住页面滚动」一类行为。
- **逻辑层留痕**：`mp.evaluate` 里可返回 Promise；组件内临时 `defineExpose` 一个写
  `uni.setStorageSync` 的方法，配 wxs `callMethod`，再用
  `mp.callWxMethod('getStorageSync', key)` 读。
- **编译偶发不退出**：日志出现 `[plugin:uts] ENOENT …uts2js…` 后进程挂起，中断会留下半截
  产物；清 `unpackage/cache/.mp-weixin/.uts2js` 后重编，命令带看门狗。
- **Web 端内置浏览器**：面板不在前台时页面定时器被节流（`setTimeout(20)` 实际约 1 秒），
  靠定时器的动画停在中途；手势回归改为同步派发触摸事件后直接读位移，不等吸附。

## 对数法（跨端差异诊断标准流程）

1. **两端同屏控制变量**：诊断卡打 `uni.getWindowInfo()`（screen/win/dpr）——排除
   模拟器与真机视口差。
2. 最小复现探针逐层量：纯 view（验布局属性）/无 min 高（验内容行盒）/显式
   box-sizing 对照/stretch 对照（flex-start）/**text 本体单独量**——一次分清
   「盒的账」还是「内容的账」。
3. 全部走 `getBoundingClientRectAsync`（两端通吃），结果 console 打单行两端贴数对比。
4. 样式规则在 Styles 面板「存在」≠生效——以量出的数为准。

## 关联

- 组件手搓规范/样式铁律：`skills/create-component.md`
- 平台分叉五级阶梯与条件编译：`skills/create-component.md` + `skills/conditional-compilation.md`
