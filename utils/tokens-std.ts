// 尺度 token 的 JS 侧镜像（与 styles/tokens-std.scss 同名同值，改值两处成对改）：供 @keyframes 与 TS 算式使用

// 正文行盒
export const STD_LEADING_LG = 22
// 列表行纵向内距
export const STD_LIST_PAD_Y = 15
// 列表行/树节点高度 = 行盒 + 留白×2（消费：app-tree 滚动区算高）
export const STD_ROW_HEIGHT = STD_LEADING_LG + STD_LIST_PAD_Y * 2

// 小字行盒
export const STD_LEADING_SM = 18
// 树空态纵向内距（与 .app-tree-empty 的 padding 同值）
export const STD_TREE_EMPTY_PAD_Y = 8
// 树空态高度 = sm 行盒 + 留白×2（消费：app-tree 空态槽高）
export const STD_TREE_EMPTY_HEIGHT = STD_LEADING_SM + STD_TREE_EMPTY_PAD_Y * 2
