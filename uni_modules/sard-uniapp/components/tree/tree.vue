<template>
  <view :class="treeClass" :style="treeStyle">
    <view v-if="lazy && !!load" :class="bem.e('load-status')">
      <sar-loading v-if="loadStatus === 'loading'" />
      <text
        v-else-if="loadStatus === 'error'"
        :class="bem.e('error')"
        @click="onErrorClick"
      >
        {{ t('error') }}
      </text>
      <text v-else-if="loadStatus === 'loaded' && treeData.length === 0">
        {{ t('noData') }}
      </text>
    </view>
    <template v-for="(node, index) of treeData" :key="node.key">
      <sar-tree-node v-if="node.visible" :index="index" :node="node" />
    </template>
  </view>

  <sar-popover
    v-if="editable"
    :options="popoverOptions"
    theme="dark"
    position="left"
    :controller="popover"
    direction="vertical"
    @select="onPopoverSelect"
  />

  <sar-dialog
    v-model:visible="dialogVisible"
    :title="currentEditTitle"
    :before-close="beforeClose"
    @visible-hook="onVisibleHook"
  >
    <view :class="bem.e('input-wrapper')">
      <sar-input
        v-model="currentEditValue"
        :placeholder="t('please')"
        :focus="focused"
      />
    </view>
  </sar-dialog>

  <sar-toast v-model:visible="toastVisible" :title="t('please')" />
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, ref, shallowRef, toRef, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid
} from "../../utils";
import {
  defaultNodeKeys,
  treeContextSymbol,
  defaultTreeProps
} from "./common";
import SarTreeNode from "../tree-node/tree-node.vue";
import SarPopover from "../popover/popover.vue";
import SarLoading from "../loading/loading.vue";
import { usePopover } from "../popover";
import SarInput from "../input/input.vue";
import SarDialog from "../dialog/dialog.vue";
import SarToast from "../toast/toast.vue";
import { useTranslate } from "../locale";
import { recurAncestor, recurDescendant, recurNodes } from "./utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {TreeNode[]} data 树形数据，默认值：-。
 * @property {TreeNodeKeys} nodeKeys 节点对象的键名，默认值：defaultNodeKeys。
 * @property {boolean} defaultExpandAll 是否默认展开所有节点，默认值：false。
 * @property {(string | number)[]} defaultExpandedKeys 默认展开的节点的 key，默认值：-。
 * @property {boolean} accordion 是否每次只展示一个同级树节点，默认值：false。
 * @property {boolean} selectable 节点是否可被选择（复选），默认值：false。
 * @property {boolean} checkStrictly 可选时是否严格遵循父子不关联的做法（复选），默认值：false。
 * @property {(string | number)[]} defaultCheckedKeys 默认勾选的节点的 key 的数组（复选），默认值：-。
 * @property {boolean} singleSelectable 节点是否可被选择（单选），默认值：false。
 * @property {boolean} leafOnly 是否只能选择叶子节点（单选），默认值：false。
 * @property {string | number} current 当前选择的节点的 key（单选），默认值：-。
 * @property {boolean} draggable 是否可以拖拽节点，默认值：false。
 * @property {boolean} editable 是否可编辑节点（增删改），默认值：false。
 * @property {'lenient' | 'strict'} filterMode 节点过滤模式，默认值：'lenient'。
 * @property {(value: string, node: TreeStateNode) => boolean} filterMethod 自定义过滤方法，默认值：-。
 * @property {boolean} lazy 是否懒加载子节点，需与 load 方法结合使用，默认值：false。
 * @property {(node?: TreeStateNode) => Promise<TreeNode[]> | TreeNode[]} load 加载子树数据的方法，仅当 lazy 属性为true 时生效，默认值：-。
 * @event {(key: string | number, node: TreeStateNode) => void} update 选择节点后触发（单选）
 * @event {(key: string | number, node: TreeStateNode) => void} select 选择节点后触发（单选）
 * @event {(event: {checked: boolean; node: TreeStateNode}) => void} check 点击树节点复选框时触发
 * @event {(event: {event: any; node: TreeStateNode}) => void} node-click 点击树节点时触发
 */
export default  _defineComponent({
  components: {
    SarTreeNode,
    SarPopover,
    SarLoading,
    SarInput,
    SarDialog,
    SarToast,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "tree",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    data: { type: Array, required: false },
    nodeKeys: { type: Object, required: false },
    defaultExpandAll: { type: Boolean, required: false },
    defaultExpandedKeys: { type: Array, required: false },
    accordion: { type: Boolean, required: false },
    selectable: { type: Boolean, required: false },
    checkStrictly: { type: Boolean, required: false },
    singleSelectable: { type: Boolean, required: false },
    leafOnly: { type: Boolean, required: false },
    current: { type: [String, Number], required: false },
    defaultCheckedKeys: { type: Array, required: false },
    draggable: { type: Boolean, required: false },
    editable: { type: Boolean, required: false },
    filterMode: { type: String, required: false },
    filterMethod: { type: Function, required: false },
    lazy: { type: Boolean, required: false },
    load: { type: Function, required: false }
  }, defaultTreeProps()),
  emits: ["update:current", "select", "check", "node-click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("tree");
    const { t } = useTranslate("tree");
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultNodeKeys, props.nodeKeys);
    });
    const treeData = ref([]);
    let treeMap = {};
    const totalLevel = ref(0);
    const toTreeStateNodes = (nodes, parent) => {
      return nodes.map((node) => {
        const key = node[fieldKeys.value.key] ?? uniqid();
        const stateNode = reactive({
          title: node[fieldKeys.value.title],
          key,
          expanded: props.defaultExpandAll ? true : false,
          checked: false,
          indeterminate: false,
          parent,
          level: 0,
          offsetLevel: 0,
          visible: true,
          disabled: !!node.disabled,
          isLeaf: node[fieldKeys.value.isLeaf],
          loadStatus: "idle",
          depth: parent ? parent.depth + 1 : 0
        });
        if (node.children && node.children.length) {
          stateNode.children = toTreeStateNodes(node.children, stateNode);
        }
        treeMap[key] = stateNode;
        return stateNode;
      });
    };
    const setExpandedByNode = (node, expanded, reflow = true) => {
      node.expanded = expanded;
      if (node.expanded) {
        recurAncestor(node.parent, (node2) => {
          node2.expanded = true;
        });
        if (props.accordion) {
          const siblings = node.parent ? node.parent.children : treeData.value;
          siblings.forEach((sibling) => {
            if (sibling !== node) {
              sibling.expanded = false;
            }
          });
        }
      }
      if (reflow) {
        setRenderPosition();
      }
    };
    const toggleExpandedByNode = (node) => {
      setExpandedByNode(node, !node.expanded);
    };
    const setExpanded = (key, expanded) => {
      const node = treeMap[key];
      if (node && node.expanded !== expanded) {
        setExpandedByNode(node, expanded);
      }
    };
    const toggleExpanded = (key) => {
      const node = treeMap[key];
      if (node) {
        toggleExpandedByNode(node);
      }
    };
    const setExpandedKeys = (keys) => {
      recurNodes(treeData.value, (node) => {
        node.expanded = false;
      });
      keys.forEach((key) => {
        const node = treeMap[key];
        if (node && !node.expanded) {
          setExpandedByNode(node, true, false);
        }
      });
      setRenderPosition();
    };
    const getExpandedKeys = () => {
      const expandedKeys = [];
      treeData.value.forEach((node) => {
        recurDescendant(node, (node2) => {
          if (node2.expanded) {
            expandedKeys.push(node2.key);
          }
        });
      });
      return expandedKeys;
    };
    const setCheckedByNode = (node, checked) => {
      if (props.checkStrictly) {
        node.checked = checked;
      } else {
        recurDescendant(node, (node2) => {
          node2.checked = checked;
          node2.indeterminate = false;
        });
        updateAncestorChecked(node.parent);
      }
    };
    const updateAncestorChecked = (parentNode) => {
      if (!props.checkStrictly) {
        recurAncestor(parentNode, (node) => {
          const children = node.children || [];
          const numChecked = children.filter((node2) => node2.checked).length;
          node.checked = numChecked > 0 && numChecked === children.length;
          node.indeterminate = !node.checked && (numChecked > 0 || children.some((node2) => node2.indeterminate));
        });
      }
    };
    const setCheckedKeys = (keys) => {
      if (props.checkStrictly) {
        const mapKeys = keys.reduce((map, key) => {
          map[key] = true;
          return map;
        }, {});
        recurNodes(treeData.value, (node) => {
          node.checked = mapKeys[node.key] ? true : false;
        });
      } else {
        recurNodes(treeData.value, (node) => {
          node.checked = false;
          node.indeterminate = false;
        });
        keys.forEach((key) => {
          const node = treeMap[key];
          if (node && !node.checked) {
            setCheckedByNode(node, true);
          }
        });
      }
    };
    const setChecked = (key, checked) => {
      const node = treeMap[key];
      if (node) {
        setCheckedByNode(node, checked);
      }
    };
    const getCheckedKeys = () => {
      const checkedKeys = [];
      treeData.value.forEach((node) => {
        recurDescendant(node, (node2) => {
          if (node2.checked) {
            checkedKeys.push(node2.key);
          }
        });
      });
      return checkedKeys;
    };
    const getHalfCheckedKeys = () => {
      const halfCheckedKeys = [];
      treeData.value.forEach((node) => {
        recurDescendant(node, (node2) => {
          if (node2.indeterminate) {
            halfCheckedKeys.push(node2.key);
          }
        });
      });
      return halfCheckedKeys;
    };
    const prepend = (node, newNode) => {
      const children = node.children ??= [];
      children.unshift(newNode);
      newNode.parent = node;
      node.expanded = true;
      updateAncestorChecked(node.parent);
      recurDescendant(newNode, (node2) => {
        treeMap[node2.key] = node2;
      });
      setRenderPosition();
    };
    const append = (node, newNode) => {
      const children = node.children ??= [];
      children.push(newNode);
      newNode.parent = node;
      node.expanded = true;
      updateAncestorChecked(node.parent);
      recurDescendant(newNode, (node2) => {
        treeMap[node2.key] = node2;
      });
      setRenderPosition();
    };
    const appendRoot = (newNode) => {
      treeData.value.push(newNode);
      newNode.parent = null;
      recurDescendant(newNode, (node) => {
        treeMap[node.key] = node;
      });
      setRenderPosition();
    };
    const before = (node, newNode) => {
      const siblings = node.parent ? node.parent.children : treeData.value;
      siblings.splice(siblings.indexOf(node), 0, newNode);
      newNode.parent = node.parent;
      updateAncestorChecked(node.parent);
      recurDescendant(newNode, (node2) => {
        treeMap[node2.key] = node2;
      });
      setRenderPosition();
    };
    const after = (node, newNode) => {
      const siblings = node.parent ? node.parent.children : treeData.value;
      siblings.splice(siblings.indexOf(node) + 1, 0, newNode);
      newNode.parent = node.parent;
      updateAncestorChecked(node.parent);
      recurDescendant(newNode, (node2) => {
        treeMap[node2.key] = node2;
      });
      setRenderPosition();
    };
    const remove = (node, reflow = true) => {
      const siblings = node.parent ? node.parent.children : treeData.value;
      siblings.splice(siblings.indexOf(node), 1);
      if (siblings.length === 0 && node.parent) {
        node.parent.children = void 0;
      }
      updateAncestorChecked(node.parent);
      recurDescendant(node, (node2) => {
        delete treeMap[node2.key];
      });
      if (reflow) {
        setRenderPosition();
      }
    };
    const levelup = (node) => {
      if (node.parent) {
        remove(node, false);
        after(node.parent, node);
      }
    };
    const leveldown = (node) => {
      const siblings = node.parent ? node.parent.children : treeData.value;
      const index = siblings.indexOf(node);
      if (index > 0) {
        remove(node, false);
        const prevNode = siblings[index - 1];
        prevNode.expanded = true;
        append(prevNode, node);
      }
    };
    const drop = (dropOriginNode, dropTargetNode, position) => {
      remove(dropOriginNode, false);
      if (position === -1) {
        before(dropTargetNode, dropOriginNode);
      } else {
        if (dropTargetNode.children && dropTargetNode.expanded) {
          prepend(dropTargetNode, dropOriginNode);
        } else {
          after(dropTargetNode, dropOriginNode);
        }
      }
    };
    const addRootNode = () => {
      currentEditValue.value = "";
      currentEditType.value = "root";
      dialogVisible.value = true;
    };
    const getCleanTreeData = () => {
      function recur(nodes) {
        return nodes.map((node) => {
          const cleanNode = {
            title: node.title,
            key: node.key
          };
          if (node.children) {
            cleanNode.children = recur(node.children);
          }
          return cleanNode;
        });
      }
      return recur(treeData.value);
    };
    const setRenderPosition = () => {
      let count = 0;
      function recur(nodes, parent) {
        nodes.forEach((node) => {
          node.depth = parent ? parent.depth + 1 : 0;
          if (node.visible) {
            node.level = count++;
          }
          if (node.children && node.expanded) {
            recur(node.children, node);
          }
        });
      }
      recur(treeData.value, null);
      totalLevel.value = count;
    };
    const toggleCheck = (node, checked) => {
      setCheckedByNode(node, checked);
      emit("check", {
        checked,
        node
      });
    };
    const loadStatus = ref("loaded");
    const initialize = async () => {
      if (props.lazy && props.load) {
        try {
          loadStatus.value = "loading";
          const data = await props.load();
          loadStatus.value = "loaded";
          initializeTree(data);
        } catch {
          loadStatus.value = "error";
        }
      } else {
        initializeTree(props.data);
      }
    };
    const initializeTree = (data) => {
      treeData.value = toTreeStateNodes(data, null);
      if (props.defaultCheckedKeys && props.defaultCheckedKeys.length > 0) {
        setCheckedKeys(props.defaultCheckedKeys);
      }
      if (props.defaultExpandedKeys && props.defaultExpandedKeys.length > 0) {
        setExpandedKeys(props.defaultExpandedKeys);
      }
      setRenderPosition();
    };
    const onErrorClick = () => {
      initialize();
    };
    watch(
      () => props.data,
      () => {
        initializeTree(props.data);
      }
    );
    initialize();
    const popoverOptions = [
      { id: "sibling", icon: "plus", text: t("addSibling") },
      { id: "child", icon: "plus", text: t("addChild") },
      { id: "minus", icon: "minus", text: t("removeNode") },
      { id: "edit", icon: "pencil-square", text: t("edit") }
    ];
    const popover = usePopover();
    let currentEditNode;
    const currentEditType = ref();
    const currentEditValue = ref("");
    const mapEditTypeTitle = {
      sibling: t("addSibling"),
      child: t("addChild"),
      root: t("addRoot"),
      edit: t("edit"),
      minus: ""
    };
    const currentEditTitle = computed(() => {
      return mapEditTypeTitle[currentEditType.value];
    });
    const dialogVisible = ref(false);
    const toastVisible = ref(false);
    const onPopoverSelect = (option) => {
      currentEditType.value = option.id;
      if (currentEditNode) {
        switch (option.id) {
          case "sibling":
          case "child":
          case "edit":
            currentEditValue.value = option.id === "edit" ? String(currentEditNode.title) : "";
            dialogVisible.value = true;
            break;
          case "minus":
            remove(currentEditNode);
            break;
        }
      }
    };
    const beforeClose = (type) => {
      if (type === "confirm") {
        if (currentEditValue.value.trim() === "") {
          toastVisible.value = true;
          return false;
        }
        switch (currentEditType.value) {
          case "sibling":
          case "child":
          case "root": {
            const newNode = reactive({
              title: currentEditValue.value,
              key: uniqid(),
              expanded: false,
              checked: false,
              indeterminate: false,
              parent: null,
              level: 0,
              offsetLevel: 0,
              visible: true,
              disabled: false,
              isLeaf: false,
              loadStatus: "idle",
              depth: 0
            });
            switch (currentEditType.value) {
              case "sibling":
                after(currentEditNode, newNode);
                break;
              case "child":
                append(currentEditNode, newNode);
                break;
              case "root":
                appendRoot(newNode);
                break;
            }
            break;
          }
          case "edit":
            currentEditNode.title = currentEditValue.value;
            break;
        }
      }
    };
    const edit = (node, getEditRect) => {
      currentEditNode = node;
      popover.show(getEditRect);
    };
    const focused = ref(false);
    const onVisibleHook = (name) => {
      focused.value = name === "after-enter";
    };
    function defaultFilterMethod(value, node) {
      return String(node.title).includes(value);
    }
    function filter(searchString) {
      const filterMethod = props.filterMethod || defaultFilterMethod;
      function recur(nodes) {
        nodes.forEach((node) => {
          node.visible = filterMethod(searchString, node);
          if (node.children) {
            if (node.visible && props.filterMode === "lenient") {
              recurNodes(node.children, (node2) => {
                node2.visible = true;
              });
            } else {
              recur(node.children);
            }
            if (!node.visible && node.children.some((node2) => node2.visible)) {
              node.visible = true;
            }
          }
          if (node.visible) {
            recurAncestor(node.parent, (node2) => {
              node2.expanded = true;
            });
          }
        });
      }
      recur(treeData.value);
      setRenderPosition();
    }
    const currentKey = shallowRef(props.current);
    watch(
      () => props.current,
      () => {
        currentKey.value = props.current;
      }
    );
    const singleSelect = (node) => {
      if (currentKey.value !== node.key) {
        currentKey.value = node.key;
        emit("update:current", node.key, node);
        emit("select", node.key, node);
      }
    };
    const nodeClick = (node, event) => {
      emit("node-click", {
        node,
        event
      });
    };
    const context = reactive({
      selectable: toRef(() => props.selectable),
      draggable: toRef(() => props.draggable),
      editable: toRef(() => props.editable),
      singleSelectable: toRef(() => props.singleSelectable),
      leafOnly: toRef(() => props.leafOnly),
      treeData: toRef(() => treeData.value),
      load: toRef(() => props.load),
      lazy: toRef(() => props.lazy),
      setExpandedByNode,
      toggleExpandedByNode,
      setCheckedByNode,
      levelup,
      leveldown,
      drop,
      toggleCheck,
      edit,
      currentKey,
      singleSelect,
      nodeClick,
      toTreeStateNodes,
      setRenderPosition
    });
    provide(treeContextSymbol, context);
    __expose({
      setExpanded,
      toggleExpanded,
      setExpandedKeys,
      getExpandedKeys,
      getCheckedKeys,
      getHalfCheckedKeys,
      setCheckedKeys,
      setChecked,
      filter,
      addRootNode,
      getCleanTreeData
    });
    const treeClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const treeStyle = computed(() => {
      return stringifyStyle(
        {
          height: `calc(var(--sar-tree-node-height) * ${totalLevel.value})`
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, t, fieldKeys, treeData, get treeMap() {
      return treeMap;
    }, set treeMap(v) {
      treeMap = v;
    }, totalLevel, toTreeStateNodes, setExpandedByNode, toggleExpandedByNode, setExpanded, toggleExpanded, setExpandedKeys, getExpandedKeys, setCheckedByNode, updateAncestorChecked, setCheckedKeys, setChecked, getCheckedKeys, getHalfCheckedKeys, prepend, append, appendRoot, before, after, remove, levelup, leveldown, drop, addRootNode, getCleanTreeData, setRenderPosition, toggleCheck, loadStatus, initialize, initializeTree, onErrorClick, popoverOptions, popover, get currentEditNode() {
      return currentEditNode;
    }, set currentEditNode(v) {
      currentEditNode = v;
    }, currentEditType, currentEditValue, mapEditTypeTitle, currentEditTitle, dialogVisible, toastVisible, onPopoverSelect, beforeClose, edit, focused, onVisibleHook, defaultFilterMethod, filter, currentKey, singleSelect, nodeClick, context, treeClass, treeStyle, SarTreeNode, SarPopover, SarLoading, SarInput, SarDialog, SarToast };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>