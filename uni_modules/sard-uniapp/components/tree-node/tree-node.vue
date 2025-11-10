<template>
  <view
    :class="nodeClass"
    :style="nodeStyle"
    @touchstart="onNodeTouchStart"
    @touchend="onNodeTouchEnd"
    @touchcancel="onNodeTouchEnd"
    @mousedown="onNodeMouseDown"
    @click="onNodeClick"
  >
    <view :style="indentStyle"></view>
    <view :class="arrowClass">
      <sar-icon family="sari" name="right" />
    </view>
    <sar-loading
      v-if="node.loadStatus === 'loading'"
      :class="bem.e('loading')"
    />
    <view
      v-if="treeContext.selectable || canSingleSelectable"
      :class="selectionClass"
      @touchstart.stop="onSelectionTouchStart"
      @touchend.stop="onSelectionTouchEnd"
      @touchcancel.stop="onSelectionTouchEnd"
      @mousedown.stop="onSelectionMouseDown"
      @click.stop
    >
      <sar-checkbox
        v-if="treeContext.selectable"
        readonly
        :checked="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="node.disabled"
      />
      <sar-radio
        v-if="canSingleSelectable"
        readonly
        :checked="isSingleChecked"
        :disabled="node.disabled"
      />
    </view>
    <view :class="bem.e('title')">
      {{ node.title }}
    </view>
    <view
      v-if="treeContext.draggable || treeContext.editable"
      :class="bem.e('toolbar')"
    >
      <view
        v-if="treeContext.editable"
        :id="editId"
        :class="editClass"
        @touchstart.stop.prevent="onEditTouchStart"
        @touchend="onEditTouchEnd"
        @touchcancel="onEditTouchEnd"
        @mousedown.stop="onEditMouseDown"
        @click.stop
      >
        <sar-icon family="sari" name="pencil-square" />
      </view>
      <view
        v-if="treeContext.draggable"
        :class="bem.e('drag')"
        :id="dragId"
        @touchstart.stop.prevent="onDragTouchStart"
        @touchmove.stop.prevent="onDragTouchMove"
        @touchend="onDragTouchEnd"
        @touchcancel="onDragTouchEnd"
        @mousedown.stop="onDragMouseDown"
        @click.stop
      >
        <sar-icon family="sari" name="list" />
        <view :class="bem.e('level-btn')">
          <sar-icon v-if="isLastNode" family="sari" name="left" />
          <sar-icon v-if="index !== 0" family="sari" name="right" />
        </view>
      </view>
    </view>
  </view>

  <template
    v-if="
      !isMergedLeaf &&
      node.expanded &&
      node.children &&
      node.children.length > 0
    "
  >
    <template v-for="(node, index) of node.children" :key="node.key">
      <sar-tree-node v-if="node.visible" :index="index" :node="node" />
    </template>
  </template>

  <sar-popover
    v-if="treeContext.draggable"
    :options="popoverOptions"
    theme="dark"
    position="left"
    :controller="popover"
    direction="horizontal"
    @select="onPopoverSelect"
  />
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, inject, onMounted, ref } from "vue";
import {
  classNames,
  createBem,
  getBoundingClientRect,
  clamp,
  stringifyStyle,
  uniqid
} from "../../utils";
import {
  treeContextSymbol
} from "../tree/common";
import { useMouseDown, useSimulatedClick, useSimulatedPress } from "../../use";
import SarIcon from "../icon/icon.vue";
import SarCheckbox from "../checkbox/checkbox.vue";
import SarRadio from "../radio/radio.vue";
import SarPopover from "../popover/popover.vue";
import { usePopover } from "../popover";
import { getNodeLevel, recurDescendant } from "../tree/utils";
export default  _defineComponent({
  components: {
    SarIcon,
    SarCheckbox,
    SarRadio,
    SarPopover,
  },
  ...{
    name: "SarTreeNode",
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "tree-node",
  props: {
    node: { type: Object, required: true },
    index: { type: Number, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("tree");
    const treeContext = inject(treeContextSymbol);
    const level = computed(() => {
      return getNodeLevel(props.node);
    });
    const nodeOpacity = ref(0);
    onMounted(() => {
      setTimeout(() => {
        nodeOpacity.value = 1;
      }, 30);
    });
    const instance = getCurrentInstance();
    const nodeId = uniqid();
    let dropTargetNode;
    let dropPosition;
    const dragging = ref(false);
    let nodeRect;
    const translateY = ref(0);
    let obviousNodes = [];
    const onDragStart = () => {
      obviousNodes = [];
      treeContext.treeData.forEach((node) => {
        recurDescendant(node, (node2) => {
          obviousNodes.push(node2);
          if (!node2.expanded) {
            return true;
          }
        });
      });
    };
    const onDragMove = (offset) => {
      translateY.value = offset.y;
      const nodeHeight = nodeRect.height;
      const currentIndex = obviousNodes.findIndex((node) => node === props.node);
      const offsetIndex = Math.floor(Math.abs(offset.y) / nodeHeight + 0.5) * (offset.y < 0 ? -1 : 1);
      const targetIndex = clamp(
        currentIndex + offsetIndex,
        0,
        obviousNodes.length - 1
      );
      const targetNode = obviousNodes[targetIndex];
      if (dropTargetNode !== targetNode) {
        obviousNodes.forEach((node, index) => {
          node.offsetLevel = index < currentIndex ? index >= targetIndex ? 1 : 0 : index > currentIndex ? index <= targetIndex ? -1 : 0 : 0;
        });
        dropTargetNode = targetNode;
        dropPosition = targetNode === props.node ? 0 : offset.y < 0 ? -1 : 1;
      }
    };
    const onDragEnd = () => {
      if (dropTargetNode && dropPosition && dropTargetNode !== props.node) {
        treeContext.drop(props.node, dropTargetNode, dropPosition);
      }
      dropTargetNode = void 0;
      dropPosition = void 0;
      obviousNodes.forEach((node) => {
        node.offsetLevel = 0;
      });
      translateY.value = 0;
    };
    const [onDragSimulatedClickTouchStart, onDragSimulatedClickTouchEnd] = useSimulatedClick(() => {
      if (popoverOptions.value.length > 0) {
        popover.show();
      }
    }, 300);
    const [
      onDragSimulatedPressTouchStart,
      onDragSimulatedPressTouchMove,
      onDragSimulatedPressTouchEnd
    ] = useSimulatedPress({
      start: () => {
        dragging.value = true;
        treeContext.setExpandedByNode(props.node, false);
        onDragStart();
      },
      move: (_, { delta }) => {
        if (nodeRect) {
          onDragMove(delta);
        }
      },
      end: () => {
        dragging.value = false;
        onDragEnd();
      },
      duration: 150
    });
    const onDragTouchStart = async (event) => {
      onDragSimulatedPressTouchStart(event);
      onDragSimulatedClickTouchStart(event);
      nodeRect = await getBoundingClientRect(`.${nodeId}`, instance);
    };
    const onDragTouchMove = (event) => {
      onDragSimulatedPressTouchMove(event);
    };
    const onDragTouchEnd = (event) => {
      nodeRect = void 0;
      onDragSimulatedClickTouchEnd(event);
      onDragSimulatedPressTouchEnd();
    };
    const onDragMouseDown = useMouseDown(
      onDragTouchStart,
      onDragTouchMove,
      onDragTouchEnd
    );
    const dragId = uniqid();
    const popover = usePopover(`#${dragId}`);
    const isLastNode = computed(() => {
      return props.node.parent && props.node.parent.children.length - 1 === props.index;
    });
    const popoverOptions = computed(() => {
      const options = [];
      if (isLastNode.value) {
        options.push({ icon: "left", id: "left" });
      }
      if (props.index !== 0) {
        options.push({ icon: "right", id: "right" });
      }
      return options;
    });
    const onPopoverSelect = (option) => {
      switch (option.id) {
        case "left":
          treeContext.levelup(props.node);
          break;
        case "right":
          treeContext.leveldown(props.node);
          break;
      }
    };
    const isMergedLeaf = computed(() => {
      const { children, isLeaf } = props.node;
      return treeContext.lazy && treeContext.load ? isLeaf : !children || children.length === 0;
    });
    const onNodeClick = async (event) => {
      const node = props.node;
      const { loadStatus, isLeaf } = node;
      if (loadStatus === "loading") {
        return;
      }
      if (treeContext.lazy && treeContext.load && !isLeaf && loadStatus === "idle") {
        try {
          node.loadStatus = "loading";
          const treeNodes = await treeContext.load(node) || [];
          node.loadStatus = "loaded";
          node.children = treeContext.toTreeStateNodes(treeNodes, node);
          if (node.children.length === 0) {
            node.isLeaf = true;
          } else {
            treeContext.setRenderPosition();
            if (node.checked) {
              treeContext.setCheckedByNode(props.node, true);
            }
          }
        } catch {
          node.loadStatus = "idle";
          return;
        }
      }
      if (!isMergedLeaf.value) {
        treeContext.toggleExpandedByNode(node);
      }
      if (canSingleSelectable.value && treeContext.leafOnly) {
        treeContext.singleSelect(node);
      }
      treeContext.nodeClick(node, event);
    };
    const nodeActive = ref(false);
    const onNodeTouchStart = () => {
      if (!isMergedLeaf.value || canSingleSelectable.value && treeContext.leafOnly) {
        nodeActive.value = true;
      }
    };
    const onNodeTouchEnd = () => {
      nodeActive.value = false;
    };
    const onNodeMouseDown = useMouseDown(
      onNodeTouchStart,
      void 0,
      onNodeTouchEnd
    );
    const canSingleSelectable = computed(() => {
      return treeContext.singleSelectable && (!treeContext.leafOnly || isMergedLeaf.value);
    });
    const isSingleChecked = computed(
      () => props.node.key === treeContext.currentKey
    );
    const [onSelectionTouchStart, onSelectionTouchEnd] = useSimulatedClick(() => {
      if (!props.node.disabled) {
        if (treeContext.selectable) {
          treeContext.toggleCheck(props.node, !props.node.checked);
        }
        if (canSingleSelectable.value) {
          treeContext.singleSelect(props.node);
        }
      }
    });
    const onSelectionMouseDown = useMouseDown(
      onSelectionTouchStart,
      void 0,
      onSelectionTouchEnd
    );
    const editId = uniqid();
    const getEditRect = async () => {
      return getBoundingClientRect(`#${editId}`, instance);
    };
    const [onEditTouchStart, onEditTouchEnd] = useSimulatedClick(() => {
      treeContext.edit(props.node, getEditRect);
    });
    const onEditMouseDown = useMouseDown(
      onEditTouchStart,
      void 0,
      onEditTouchEnd
    );
    const nodeClass = computed(() => {
      return classNames(
        bem.e("node"),
        bem.em("node", "dragging", dragging.value),
        bem.em("node", "selectable", treeContext.selectable),
        bem.em("node", "active", nodeActive.value),
        bem.em("node", "current", isSingleChecked.value),
        nodeId
      );
    });
    const nodeStyle = computed(() => {
      return stringifyStyle({
        transform: `translate3d(0,calc(var(--sar-tree-node-height) * ${props.node.level + props.node.offsetLevel} + ${dragging.value ? translateY.value : 0}px),0)`,
        opacity: nodeOpacity.value
      });
    });
    const editClass = computed(() => {
      return classNames(bem.e("edit"));
    });
    const indentStyle = computed(() => {
      return stringifyStyle({
        width: `calc(var(--sar-tree-indent-width) * ${level.value})`,
        transition: `width 300ms`
      });
    });
    const arrowClass = computed(() => {
      return classNames(
        bem.e("arrow"),
        bem.em("arrow", "expanded", props.node.expanded),
        bem.em("arrow", "is-leaf", isMergedLeaf.value)
      );
    });
    const selectionClass = computed(() => {
      return classNames(
        bem.e("selection"),
        bem.em("selection", "disabled", props.node.disabled)
      );
    });
    const __returned__ = { props, bem, treeContext, level, nodeOpacity, instance, nodeId, get dropTargetNode() {
      return dropTargetNode;
    }, set dropTargetNode(v) {
      dropTargetNode = v;
    }, get dropPosition() {
      return dropPosition;
    }, set dropPosition(v) {
      dropPosition = v;
    }, dragging, get nodeRect() {
      return nodeRect;
    }, set nodeRect(v) {
      nodeRect = v;
    }, translateY, get obviousNodes() {
      return obviousNodes;
    }, set obviousNodes(v) {
      obviousNodes = v;
    }, onDragStart, onDragMove, onDragEnd, onDragSimulatedClickTouchStart, onDragSimulatedClickTouchEnd, onDragSimulatedPressTouchStart, onDragSimulatedPressTouchMove, onDragSimulatedPressTouchEnd, onDragTouchStart, onDragTouchMove, onDragTouchEnd, onDragMouseDown, dragId, popover, isLastNode, popoverOptions, onPopoverSelect, isMergedLeaf, onNodeClick, nodeActive, onNodeTouchStart, onNodeTouchEnd, onNodeMouseDown, canSingleSelectable, isSingleChecked, onSelectionTouchStart, onSelectionTouchEnd, onSelectionMouseDown, editId, getEditRect, onEditTouchStart, onEditTouchEnd, onEditMouseDown, nodeClass, nodeStyle, editClass, indentStyle, arrowClass, selectionClass, SarIcon, SarCheckbox, SarRadio, SarPopover };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>