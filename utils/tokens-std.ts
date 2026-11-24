/* std 尺度 token · JS 侧镜像（与 styles/tokens-std.scss 成对维护，同名同值）。
   存在原因：CSS 变量进不了 @keyframes（x 端只认固定值）与 TS 布局算式，
   行高类数值在 JS/keyframes 里必须以字面量存在——改值两处成对改；
   交编译前一致性自查规则见 skills/create-component.md「尺度基准」（AI 内联执行） */

// 行盒（Apple Body 行高，= --std-leading-lg）
export const STD_LEADING_LG = 22
// 列表行纵向留白（= --std-list-pad-y，Apple 设置页实测 52.3pt 的留白 15）
export const STD_LIST_PAD_Y = 15
// 列表行/树节点高度 = 行盒 + 留白×2（消费：app-tree 滚动区算高）
export const STD_ROW_HEIGHT = STD_LEADING_LG + STD_LIST_PAD_Y * 2

// sm 文字行盒（= --std-leading-sm，Footnote 13/18）
export const STD_LEADING_SM = 18
// 树空态上下留白（CSS 侧 .app-tree-empty padding 同值字面量）
export const STD_TREE_EMPTY_PAD_Y = 8
// 树空态高度 = sm 行盒 + 留白×2（消费：app-tree 空态槽高）
export const STD_TREE_EMPTY_HEIGHT = STD_LEADING_SM + STD_TREE_EMPTY_PAD_Y * 2
