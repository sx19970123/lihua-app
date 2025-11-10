<template>
  <view :class="navbarPitClass" :style="navbarPitStyle">
    <sar-status-bar v-if="statusBar" />
    <view :class="bem.e('content')"></view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import SarStatusBar from "../status-bar/status-bar.vue";
import { classNames, createBem, stringifyStyle } from "../../utils";
import { computed } from "vue";
export default  _defineComponent({
  components: {
    SarStatusBar,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "navbar-pit",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    statusBar: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("navbar-pit");
    const navbarPitClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const navbarPitStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, navbarPitClass, navbarPitStyle, SarStatusBar };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>