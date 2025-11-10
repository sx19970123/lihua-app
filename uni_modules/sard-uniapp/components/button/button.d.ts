import { type ButtonProps, type ButtonSlots } from './common';
declare function __VLS_template(): Readonly<ButtonSlots> & ButtonSlots;
declare const __VLS_component: import("vue").DefineComponent<ButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<ButtonProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    size: "mini" | "small" | "medium" | "large";
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "default" | "pale" | "mild" | "outline" | "text" | "pale-text";
    icon: string;
    loading: boolean;
    disabled: boolean;
    background: string;
    color: string;
    square: boolean;
    iconSize: string;
    theme: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "neutral";
    round: boolean;
    loadingType: "clock" | "circular";
    block: boolean;
    inline: boolean;
    iconFamily: string;
    formType: string;
    openType: string;
    appParameter: string;
    hoverStopPropagation: boolean;
    lang: string;
    sessionFrom: string;
    sendMessageTitle: string;
    sendMessagePath: string;
    sendMessageImg: string;
    showMessageCard: boolean;
    groupId: string;
    guildId: string;
    publicId: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
