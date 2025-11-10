<template>
  <template v-for="(node, index) of nodes" :key="node.key">
    <sar-tree-node v-if="node.visible" :index="index" :node="node" />
  </template>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import SarTreeNode from "../tree-node/tree-node.vue";
export default  _defineComponent({
  components: {
    SarTreeNode,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "tree-branch",
  props: {
    nodes: { type: Array, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { SarTreeNode };
    return __returned__;
  }
});
</script>
