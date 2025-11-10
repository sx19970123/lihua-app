<template>
  <button
    :class="buttonClass"
    :style="buttonStyle"
    :disabled="isDisabled || loading"
    :hover-class="bem.m('hover')"
    :form-type="formType"
    :open-type="openType"
    :app-parameter="appParameter"
    :hover-stop-propagation="hoverStopPropagation"
    :lang="lang"
    :session-from="sessionFrom"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    :group-id="groupId"
    :guild-id="guildId"
    :public-id="publicId"
    @click="onClick"
    @getphonenumber="onGetphonenumber"
    @getuserinfo="onGetuserinfo"
    @error="onError"
    @opensetting="onOpensetting"
    @launchapp="onLaunchapp"
    @contact="onContact"
    @chooseavatar="onChooseavatar"
    @agreeprivacyauthorization="onAgreeprivacyauthorization"
    @addgroupapp="onAddgroupapp"
    @chooseaddress="onChooseaddress"
    @chooseinvoicetitle="onChooseinvoicetitle"
    @subscribe="onSubscribe"
    @login="onLogin"
  >
    <view
      v-if="loading || icon"
      :class="
        classNames(bem.e('icon'), bem.em('icon', 'with-slot', !!$slots.default))
      "
    >
      <sar-loading v-if="loading" :type="loadingType" />
      <sar-icon
        v-else-if="icon"
        :name="icon"
        :family="iconFamily"
        :size="iconSize"
      />
    </view>
    <slot></slot>
  </button>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarLoading from "../loading/loading.vue";
import SarIcon from "../icon/icon.vue";
import { useFormContext } from "../form/common";
import {
  defaultButtonProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'default' | 'pale' | 'mild' | 'outline' | 'text' | 'pale-text'} type 按钮类型，默认值：'default'。
 * @property {'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'} theme 按钮主题色，默认值：'primary'。
 * @property {'mini' | 'small' | 'medium' | 'large'} size 按钮尺寸，默认值：'medium'。
 * @property {boolean} round 圆角按钮，默认值：false。
 * @property {boolean} square 方形按钮，默认值：false。
 * @property {boolean} disabled 禁用按钮，默认值：false。
 * @property {boolean} loading 加载状态，默认值：false。
 * @property {'clock' | 'circular'} loadingType 加载类型，默认值：'circular'。
 * @property {string} color 自定义文字颜色，默认值：-。
 * @property {string} background 自定义背景颜色，默认值：-。
 * @property {boolean} block 将按钮设为块级元素，默认值：true。
 * @property {boolean} inline 设置为 true，则为行内块元素，否则取决于 block，默认值：false。
 * @property {string} icon 图标名称，默认值：-。
 * @property {string} iconFamily 图标字体，默认值：-。
 * @property {string} iconSize 图标尺寸，默认值：-。
 * @property {string} formType 用于 \<form> 组件，点击分别会触发 \<form> 组件的 submit/reset 事件，默认值：-。
 * @property {string} openType 开放能力，默认值：-。
 * @property {string} appParameter 打开 APP 时，向 APP 传递的参数，open-type=launchApp 时有效，默认值：-。
 * @property {boolean} hoverStopPropagation 指定是否阻止本节点的祖先节点出现点击态，默认值：false。
 * @property {string} lang 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。，默认值：'en'。
 * @property {string} sessionFrom 会话来源，open-type="contact"时有效，默认值：-。
 * @property {string} sendMessageTitle 会话内消息卡片标题，open-type="contact"时有效，默认值：当前标题。
 * @property {string} sendMessagePath 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效，默认值：当前分享路径。
 * @property {string} sendMessageImg 会话内消息卡片图片，open-type="contact"时有效，默认值：截图。
 * @property {boolean} showMessageCard 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效，默认值：false。
 * @property {string} groupId 打开群资料卡时，传递的群号，默认值：-。
 * @property {string} guildId 打开频道页面时，传递的频道号，默认值：-。
 * @property {string} publicId 打开公众号资料卡时，传递的号码，默认值：-。
 * @event {(event: any) => void} click 点击按钮时触发，加载和禁用状态不会触发
 * @event {(event: any) => void} getphonenumber 获取用户手机号回调
 * @event {(event: any) => void} getuserinfo 用户点击该按钮时，会返回获取到的用户信息，从返回参数的 detail 中获取到的值同 uni.getUserInfo
 * @event {(event: any) => void} error 当使用开放能力时，发生错误的回调
 * @event {(event: any) => void} opensetting 在打开授权设置页并关闭后回调
 * @event {(event: any) => void} launchapp 从小程序打开 App 成功的回调
 * @event {(event: any) => void} contact 客服消息回调
 * @event {(event: any) => void} chooseavatar 获取用户头像回调
 * @event {(event: any) => void} agreeprivacyauthorization 用户同意隐私协议事件回调，open-type="agreePrivacyAuthorization"时有效
 * @event {(event: any) => void} addgroupapp 添加群应用的回调
 * @event {(event: any) => void} chooseaddress 调起用户编辑并选择收货地址的回调
 * @event {(event: any) => void} chooseinvoicetitle 用户选择发票抬头的回调
 * @event {(event: any) => void} subscribe 订阅消息授权回调
 * @event {(event: any) => void} login 登录回调
 */
export default  _defineComponent({
  components: {
    SarLoading,
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "button",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    theme: { type: String, required: false },
    size: { type: String, required: false },
    round: { type: Boolean, required: false },
    square: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingType: { type: String, required: false },
    color: { type: String, required: false },
    background: { type: String, required: false },
    block: { type: Boolean, required: false },
    inline: { type: Boolean, required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconSize: { type: String, required: false },
    formType: { type: String, required: false },
    openType: { type: String, required: false },
    appParameter: { type: String, required: false },
    hoverStopPropagation: { type: Boolean, required: false },
    lang: { type: String, required: false },
    sessionFrom: { type: String, required: false },
    sendMessageTitle: { type: String, required: false },
    sendMessagePath: { type: String, required: false },
    sendMessageImg: { type: String, required: false },
    showMessageCard: { type: Boolean, required: false },
    groupId: { type: String, required: false },
    guildId: { type: String, required: false },
    publicId: { type: String, required: false }
  }, defaultButtonProps),
  emits: ["click", "getphonenumber", "getuserinfo", "error", "opensetting", "launchapp", "contact", "chooseavatar", "agreeprivacyauthorization", "addgroupapp", "chooseaddress", "chooseinvoicetitle", "subscribe", "login"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("button");
    const formContext = useFormContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const onClick = (event) => {
      emit("click", event);
    };
    const onGetphonenumber = (event) => {
      emit("getphonenumber", event);
    };
    const onGetuserinfo = (event) => {
      emit("getuserinfo", event);
    };
    const onError = (event) => {
      emit("error", event);
    };
    const onOpensetting = (event) => {
      emit("opensetting", event);
    };
    const onLaunchapp = (event) => {
      emit("launchapp", event);
    };
    const onContact = (event) => {
      emit("contact", event);
    };
    const onChooseavatar = (event) => {
      emit("chooseavatar", event);
    };
    const onAgreeprivacyauthorization = (event) => {
      emit("agreeprivacyauthorization", event);
    };
    const onAddgroupapp = (event) => {
      emit("addgroupapp", event);
    };
    const onChooseaddress = (event) => {
      emit("chooseaddress", event);
    };
    const onChooseinvoicetitle = (event) => {
      emit("chooseinvoicetitle", event);
    };
    const onSubscribe = (event) => {
      emit("subscribe", event);
    };
    const onLogin = (event) => {
      emit("login", event);
    };
    const buttonClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.size),
        bem.m(props.type),
        bem.m(`${props.type}-${props.theme}`),
        bem.m("round", props.round),
        bem.m("square", props.square),
        bem.m("disabled", isDisabled.value),
        bem.m("loading", props.loading),
        bem.m("block", props.icon || props.inline ? false : props.block),
        bem.m("iconic", !!props.icon || props.loading),
        props.rootClass
      );
    });
    const buttonStyle = computed(() => {
      return stringifyStyle(
        {
          color: props.color,
          background: props.background
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, formContext, isDisabled, onClick, onGetphonenumber, onGetuserinfo, onError, onOpensetting, onLaunchapp, onContact, onChooseavatar, onAgreeprivacyauthorization, onAddgroupapp, onChooseaddress, onChooseinvoicetitle, onSubscribe, onLogin, buttonClass, buttonStyle, get classNames() {
      return classNames;
    }, SarLoading, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>