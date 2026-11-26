---
name: create-component
description: 指导 lihua-app（uni-app x 蒸汽版）新建或修改公共组件（components/app-* 族）。适用于手搓组件的完整规范：官方优先三档、sard 源码参考、x 端样式铁律（单类选择器/rpx 归零/token 体系/行高 padding 直构禁 min-height）、暗色模式、按压反馈四等级（press.scss）、theme store 亮暗感知、动画瞬态化与后台恢复防御、元素常驻与烘焙字段、触区规范、注释规范（只写用途不写背景）。跨端坑点详规见 cross-platform-pitfalls.md。
---

# 新建/修改公共组件（uni-app x 手搓组件规范）

uni-app x 没有可用组件库（sard 是 uni-app 版不可用），公共组件全部手搓。本仓组件以
sard-uniapp 为视觉/交互基准（源码参考：`npm pack sard-uniapp` 解包读 `components/<名>/`），
在 x 端平台限制下重写。新建或改动 `components/app-*` 组件时逐节核对。

## 前置流程（落笔前必做）

1. **官方优先三档**：① x 内置组件（button/checkbox/loading…）改 css 能用则直接用；
   ② uni-ui x 官方扩展（uni_modules，如 uni-icons-x）覆盖则导入用；
   ③ 都没有才手搓。已定案：弹窗=uni.showModal（不封装）；badge、tag 自建组件
   （app-badge / app-tag，不用 uni-badge-view）。
2. **读 sard 源码再落笔**，别凭文档脑补样式（app-tree 复刻走弯路的教训）。
3. 通用组件不带业务名（app-steps 非 setup-track），进 `app-*` 族；业务组件进业务域目录。

## 样式铁律（x 端限制，全部实证）

- **选择器仅单类**：后代/嵌套/`.a.b` 连写全不生效；BEM 扁平单类命名。
- 无伪类（:first-child/:not）、无伪元素（::before）——分隔线用独立 1px view，首末行
  特殊化用烘焙字段。
- **rpx 归零**，全 px（官方推荐；rpx 仅随屏宽的 width 合法，本项目无此场景）。
- 颜色/间距值层/圆角/字号/行高全走 `styles/tokens-std.scss`（`--std-*` 唯一 token 文件——
  色板 2026-11-25 平移并入，暗色自动 media dark；老 `styles/tokens.scss` 已删除，
  `--lh-*` 全族勿再引用）；字号行高经标准类 `app-t-*`/`app-c-*` 消费
  （styles/typography.scss，详规见「尺度基准」节）。
  JS/keyframes 里的行高数值走 `utils/tokens-std.ts` 镜像常量（与 scss 成对改）。
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
- **层序只在同父兄弟间排**：需要互相压盖的层做成同一父级的直接子元素并各给显式
  z-index；跨层级（孙辈压叔辈）iOS 蒸汽端不生效（cross-platform-pitfalls 坑⑧）。

## 尺度基准（2026-11-24 定，iOS 式：高度不进全局 token）

- 标准两层：`styles/tokens-std.scss`（唯一 token 文件 `--std-*`：Apple 数值+间距/圆角/
  色板语义层）+ `styles/typography.scss`（文本标准类，消费 std）；JS 侧镜像
  `utils/tokens-std.ts`（keyframes/算式消费的数值）。老 `styles/tokens.scss` 已于
  2026-11-25 全量迁毕删除。
  文本标准=CSS 工具类形态（2026-11-24 拍板，组件形态否决：MP 每文本节点一个组件实例的
  热路径成本；旧版 sard 工具类 sar-text-* 同构先例）。
- **独立文本节点默认挂标准类**：`app-t-2xs|sm|base|lg|xl|2xl|3xl`（字号+行高配对原子，
  Apple 档：Caption2 11/13、Footnote 13/18、Subhead 15/20、Body 17/22、Title2 22/28、
  Title1 28/34、LargeTitle 34/41——官方 11 档压缩为 7 档，跳过 Caption1/Callout/Title3
  需要时按官方值补；std 层行高为**绝对值成对制**，改字号必连行高=改 tokens-std/
  typography 单点，勿在使用处单覆写一边）+
  `app-c-emphasis|secondary|tertiary|fourth|primary|danger|disabled`（语义色，暗色自动）+
  `app-w-bold`；行内富文本片段（一段话内变色词）仍裸 text+组件本地类（text 子节点不能是
  组件）。**组件内使用须在 style 头 @import typography.scss**（样式隔离 2.0，全局类进不了
  组件，press.scss 同款纪律）。
- **间距语义层**（tokens-std.scss）：边距按**用途**挂 `--std-*` 语义 token——page-margin-x 16/
  list-pad-y 15·x 16/list-title-margin 16·16·8/list-icon-gap 12/card-pad-y 12·x 12/
  form-gap 12/control-pad-y-sm 6·control-pad-y 10·control-pad-y-lg 14/btn-pad-y 11/section-gap 32——同名值不同位置=不同 token，一眼可读用途；x 端值不可嵌套
  var→各带字面量=独立旋钮。**建名纪律**：只为跨页面复用概念建名（≥2 消费点），组件内
  一次性微距留组件本地；通用无概念小间隙用 `--std-gap-*` 值层（xs4/sm8/md12/lg16/xl20/
  2xl24/3xl32，与语义层同文件）。
- **高度档位表（2026-11-24 统一轮落地，同日两次按 Apple 真机截图实测修正）**：
  高度 = 行盒 + 纵向留白×2（带边框件再+边框×2）。Apple 实测三档（iPhone 402pt 机型，
  原生截图 px/3）：**小号 32 / 默认 44 / 列表行 52**，每档=行盒+对称留白——
  **紧凑档 32**（App Store「获取」胶囊 20+6×2；input small=18+6×2+边框2）；
  **控件档 44**（App Store 搜索框 44.0pt=HIG 默认控件 44×44；按钮/卡片头 22+11×2、带边框
  input/选择行 22+10×2+边框2；内距走 --std-btn-pad-y / --std-control-pad-y）；
  **列表行 52**（设置页实测 52.3pt=22+15×2；list-item/tree 节点/swipe 收起首档；
  input large 同高 22+14×2+边框2）。**分段器三档 32/44/52=外高同 app-input**（文本档同输入框：
  small 行盒 18+留白 6×2、default/large 行盒 22+留白 10×2/14×2，无边框；留白三档走
  --std-control-pad-y-sm/-y/-lg，输入框与分段器共用；内距挂段位不挂根/组——挂根滑块内缩塌缩、
  挂组段位触区塌半；2026-11-25 拍板对齐输入框，玻璃滑块同日退役）。
  **行≠控件**：早先按 UIKit 默认行高 44 推的
  「行=控件 46」已作废。按钮/列表行=padding 直构不设 height；档位内距是语义 token 自带值
  （Apple 实测，不要求落在 4pt 刻度上）。卡片头 44（2026-11-26 归控件档，内距走
  --std-btn-pad-y；卡片体/脚内距仍是 card-pad-y 12）。
- 档位做在组件 size prop（small/default/large ↔ 留白见高度档位表），高度数字由公式长出
  （iOS 原生同型：档位是组件枚举，高度是 intrinsic 产物，无公开高度 token）。组件专用的
  非典型尺寸（如 checkbox 方块）取值写在组件内，不建 token。list-item 不设 size 档
  （行高单一；带描述的行到时由内容撑高）。
- HIG 明文仅字号阶梯/控件 44×44pt/带边框控件间距 12pt；行高等无官方数值，按本公式自定。
- **JS 侧镜像**：`utils/tokens-std.ts`（STD_* 常量，与 tokens-std.scss 同名同值成对）——
  供 @keyframes 与 TS 布局算式消费（CSS 变量进不了这两处）；改尺度值两处成对改。
- **交编译前一致性自查（AI 必跑，内联临时脚本执行勿留检查文件；凡改 tokens/尺度/行高/
  样式大改后）**，全绿才交用户：① tokens-std.scss ↔ tokens-std.ts 同名同值
  （--std-list-pad-y↔STD_LIST_PAD_Y、--std-leading-lg/sm↔STD_LEADING_LG/SM、
  --std-row-height↔STD_ROW_HEIGHT——显式定高消费=tree node max-height/hit-first/arrow，
  @keyframes 用不了 var 仍为字面量）+派生式
  （STD_ROW_HEIGHT=leading-lg+list-pad-y×2、STD_TREE_EMPTY_HEIGHT=leading-sm+8×2）；
  ② 行高字面量同步=派生行高，共三处 keyframes（CSS 变量进不了 keyframes，字面量永远
  存在）：tree 收起 `app-tree-shrink` 的 from、tree 展开 `app-tree-grow` 的 to、
  swipe `app-swipe-remove` 首帧；非动画处（tree node max-height/hit-first/arrow）须挂
  `--std-row-height` 不得回退成字面量，唯一例外=tree `.app-tree-hit` 的 `height` 为派生
  字面量「行高+1」（上探 1px 并入自身高度，行距恒=行高），一并核对（内联脚本解析前先剥
  块注释——keyframes 块内声明前常带注释，不剥会误报缺失）；
  ③ 注释提前闭合（`*/` 后同一行有内容）全仓零；④ 样式块括号配平（剥注释后
  `{}`/`()`/`[]` 计数相等）零差；⑤ 老 token（--lh-text-/--lh-leading-/--lh-button-height）
  消费零。历史上两次跑偏（行 46 应 52、控件 46 应 44）均属此范围，机器查代替靠记忆。
- 存量已统一（2026-11-24 统一轮）：全局正文 17px、list/tree 行 52、input 44（small 32/
  large 52）、分段器 32/44/52（2026-11-25 对齐输入框）、checkbox 三档（方块 16/20/24、
  文字档 sm/base/lg，组件专用尺寸留字面量；2026-11-26 落地待真机验）、按钮 44、
  卡片头 44、表单间距 12、手写 45/38/13px 清零；老 `--lh-text-*/leading-*/button-height/
  segmented-height*` 已退役删除。残留暂不动：index
  尖峰页（S2-09 重做时按 std 写）、页面级锚（auth 80px/向导 48·24px）。

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
- **例外：高亮须与另一个元素同形同位、且层序在它之下**——hover-class 只能给被触元素
  自身上底色，做不到；改 JS 态驱动「影子层」：触摸落在哪段哪段现，位移 >5px 或松手
  即收，底色仍挂同一套按压类。开关用 `hover` prop（默认开，经 withDefaults）。
  先例=app-segmented。

## 动画

- **单属性**过渡可靠；**App 端 transition 不支持多效果/多时长**（官方文档），一条过渡
  驱动多个属性（如 `transition-property: transform, opacity`）不可靠——内容淡出/位移勿
  依赖它；**height 与 max-height 的 transition 在 Vapor 全灭**（Web/微信生效）。
- keyframes 宽高动画可行（5.31+）但**只支持固定值**（动态目标高度做不了，改 JS 显式
  计算高度）。
- **keyframes 收展动画四规则**（app-tree 收起/展开真机实证，2026-11-24/25；先例=
  swipe remove）：
  ① 动画类的**静态值取起始值**，终值靠 `animation-fill-mode: forwards` 保持（Vapor 仅支持
  forwards，backwards/both 标 ×）——静态值取终值时，起播前的间隙帧先落终值=先塌后弹
  （眨眼）；
  ② forwards 只动**每个状态类都显式声明**的属性（如 max-height）——只被动画写过的属性
  （opacity）类切换后无值还原，展开后内容全白；
  ③ 高度收展加 `justify-content: flex-end`（内容贴底随底边滑动）——顶对齐时首行内容
  原地被裁=「第一个子节点不动、其他节点收到它上面」；配「上探 1px 并入自身高度（行高+1）」
  使行距恒=行高、稳态与动画态几何连续；
  ④ 展开与收起同构成对（ease-out / ease-in 互为时间镜像、时长一致），两个方向都播完
  重烘焙。
- **动画瞬态化**：稳态不挂 animation（后台切换系统重置渲染层动画，常驻动画被打回起始帧
  撑空白，触摸才复原）——用前后状态快照判定「刚变化」挂变体类，播完由 JS 定时触发
  重烘焙切回稳态类（forwards 同理不可常驻）。
- 容器高度显式静态可算（不靠内容自然撑——测量链在后台恢复会陈旧）。
- v-if 无法过渡→常驻+opacity/pointer-events；同 class 复挂 animation 不重触发→双 class
  交替或 :key 重建。
- **滑块类到头不越界=自身压缩**：弹簧照常过冲（不给弹簧设墙），渲染时把越界量转成自身
  压缩——外缘钉在端点，宽度按「越界量×比例」变窄（封顶段宽 1/4）：
  `translateX(端点+压缩量/2) scaleX(剩余宽/段宽)`（缩放原点取默认居中），随弹簧恢复；
  拖过尽头同理（越界量先按阻尼计入）。先例=app-segmented。**「轨道整体位移的弹簧垫」
  「撞墙反弹」两个方案都试过被否**（2026-11-25 用户：外轨道动画去掉、撞墙生硬），勿重提。

## 结构与响应性

- **元素常驻零销毁**：批量行销毁触发框架 Element::Dispose 崩溃（SIGSEGV）——显隐走
  class（max-height/opacity）或 v-show，禁 v-if 批量切换。
- **烘焙字段+纯属性读**：class/显隐逻辑在 watchEffect 里写进 state 字段，模板只读属性；
  `:class="fn()"` 函数调用形态不追踪依赖（死路）。
- **命令式写层不与 `:style` 载体共管一键**：载体里有的键，重渲染会按载体重贴、盖掉
  setProperty 的同键写入；其常驻值须经载体落下（cross-platform-pitfalls 坑⑩）。
- **隐藏态不留贴边的被绘制元素**：收起/藏起用宽度 0 或不绘制，勿靠「平移出裁切区
  贴边」——小数宽度下露发丝线（cross-platform-pitfalls 坑⑨）。
- **按序号取 v-for 元素引用时用序号 key**：引用数组序是打补丁序，不是 DOM 序；按
  事件名等 key 重排即错位（cross-platform-pitfalls 坑⑪）。
- import 统一写 script 顶部。
- **可选布尔属性不传即 `false`**（Vue 的布尔转换；编译产物是 `{ type: Boolean, required:
  false }`，可在 `unpackage/dist/dev/app-ios/app-service.js` 里核对）。默认开的开关必须
  `withDefaults(defineProps<{…}>(), { xxx: true })`，**不能写 `props.xxx !== false`**——
  看着像默认开，实际默认关。先例教训=app-segmented 的 `block`（整页实例变成「宽度随
  内容」，用户反馈两轮「没占满一行」才定位，2026-11-26）。同日用户拍板「全都默认开，可关闭」：
  app-list-item 的 `divider`/`hover`、app-swipe-action 的 `divider` 一并改经 withDefaults
  默认开（原 `!== false` 写法=实际默认关）；**消费方约定不变**：首行或组内单行显式
  `:divider="false"`，不可点的行显式 `:hover="false"`。**脚本抽取模拟的桩必须复现这条
  转换**（没传的可选布尔先置 false、再套 withDefaults 默认值），否则测不出。

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

先例：app-swipe-action 已降至第 3 级（单核+platform/{app,mp}.ts 适配器；模板按钮组与
内容层按平台 #ifdef 各一份、只差元素 ref——MP 真机上模板 ref 致拖动失效，开发工具掩盖）；
其动画全面 JS 补间/弹簧驱动（CSS 过渡退役，见 cross-platform-pitfalls）。

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

- 触区意识（Apple 官方 accessibility 条文，2026-11-24 对齐）：控件**默认 44×44、最小
  28×28**——常规按 44 设计、紧凑件下限 28（旧口径 ≥32 作废）；**热区可大于视觉**
  （icon 居中留缓冲）。相邻按钮热区紧贴零死区（系统 toolbar 同款），视觉间距用盒内
  非对称偏移收窄。
- **视觉件不足 28 时用「内距 + 同值负外距」扩触区**：根节点 `padding: N; margin: -N`，
  热区四周各扩 N、占位不变（行高不撑到 32/44）；组内行距随之拆成「触区内距 + 下外距」
  两个耦合值；伸出祖先盒子的部分接收不到触摸。先例=app-checkbox（待真机验）。
- 触感反馈：统一走 `utils/haptic.ts`（`haptic(type, onText?)`，type=light/medium/heavy；
  try/catch 包住、接口缺失不抛出；安卓/iOS/鸿蒙与微信支持，Web 无此 API 已在工具内挡）。
  **排查「不震」用 demo 页触感自检，按显示分三种**：①「调用异常」=运行时里没有这个接口
  （`vibrate` 是 HBuilderX 5.14 才加的 API，iOS 基座比它旧就没有）→用当前 HBuilderX 重打
  基座；②「失败 system not support」=原生判定设备/系统不支持；③「成功」却没震=系统设置
  （iOS 静音模式需开「静音时播放触感」、低电量）。iOS 原生实现=先判 `supportsHaptics`
  再调系统 `impactOccurred`，**成功失败都会回调**——「回调没来」只可能是调用没到原生，
  不能归因为系统设置（2026-11-25 我先误判，被用户「两个按钮都显示未测试」纠正；次日
  自检显示调用异常、重打基座后正常，①已被证实）。定位手法可复用：蒸汽模式 `uni.*` 的原生实现在
  `HBuilderX.app/Contents/HBuilderX/plugins/uts-development-ios/.../DCloudUTSExtAPI.framework`
  （Swift 接口），JS 侧代理在同目录 `DCloudUniappRuntime.bundle/uni-app-x-framework-vapor.js`；
  二进制用 `strings` 看返回文案。先例=app-segmented 拖动到位轻震。
- **按下不冻结在途动画**：要支持「抓住飞行中的元素」的组件，冻结放在方向判定成立
  （确认横滑）那一刻，冻结位即起拖点；轻点/纵滚让位时动画照常走完。否则按下即冻结，
  一旦那次触摸走不到松手复位（手势被页面抢走等），元素就停在半路（app-segmented 先例，
  待真机验）。震动等附属调用排在手势主流程之后。
- **只允许从滑块上起拖**（用户 2026-11-25 定：拖动整个轨道不应带动滑块）：按下时判触点
  是否落在滑块范围（组左缘 + 滑块位置，`Touch.clientX` 与矩形 `left` 同为「页面可显示
  区域」口径，左右各放宽 4px），是才允许接管横滑；其余位置只响应点选。位置未知时不
  限制。先例=app-segmented（待真机验）。
- **开态起拖不接盘对侧**（侧滑类）：一侧已展开时起拖，压向对侧的位移自中线起整段
  阻尼、松手复原到收起，勿让对侧线性滑出；拖拽中的原始位移（阻尼/橡皮筋段）在开/收
  入口须先折回有效位移，补间不从原始值起跳。先例=app-swipe-action（待真机验）。

## 注释规范（全仓适用：组件/页面/工具/样式）

注释只回答「这段代码做什么用」，一两行为上限。读者是改代码的人，不是在追溯这行代码的
来历；来历写进注释会随设计演进烂在原地。

- **写**：用途；关键参数与取值含义（单位、阈值、方向约定）；改这段代码必须知道的一句话
  禁忌（如「内距必须挂段位，不挂轨道/组」「勿换 requestAnimationFrame」「idle 须沿用 mp-in」）。
- **不写（背景一律不留）**：
  - 日期、轮次、「某日用户反馈/拍板」这类经过；
  - 真机实测数值与量法、诊断结论（「实测 52.3pt」「诊断卡实锤」）；
  - 被否的备选方案与取舍推理（「曾用 X，因 Y 改 Z」「根因」「教训」「坑①」）；
  - 改动原因与新旧对比（「X 有滞后，所以不用它」「不吃掉动画头段」「该值恒为 0，故改取
    Y」）——只描述当前代码做什么；禁忌也写成现在的做法（「承接速度取最近两段位移」），
    不写成对另一种做法的否定；
  - 计划阶段编号（S2-03、A2/B 阶段）；
  - 出处与对标（Apple/HIG/iOS 对齐、sard 复刻、「对标组件库」「官方姿势」）；
  - 会过期的数字——尺寸档位这类以代码为准的值不在注释里重复（prop 注释写「三档」不写
    具体高度，数字只留在样式与 token 里）。
- **去向**：设计决策链与否决理由→commit message；标准出处与演进史→本 skill 与记忆；
  平台坑点清单→`cross-platform-pitfalls.md`，不放组件文件尾（档案式长注释不进代码）。
- 文件头注释同样从简；模板 `<!-- -->`、script、style 三处一视同仁。组件头仍按「平台分叉
  组件」节标明分叉级位与原因（一句话）。改写旧代码时顺手把碰到的背景注释按本规范清掉。

## 收尾自查

- 标签配对校验（模板改动必做）；pages/ 零 #ifdef；注释按「注释规范」节。
- 新组件在 `pages/component/` 建独立 demo 页（@import `styles/demo.scss`），并在
  `pages/component/menu.uvue` 对应分组登记。
