import { type PopoutProps, type PopoutSlots } from './common';
declare function __VLS_template(): Readonly<PopoutSlots> & PopoutSlots;
declare const __VLS_component: import("vue").DefineComponent<PopoutProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<PopoutProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "compact" | "loose";
    title: string;
    visible: boolean;
    overlay: boolean;
    duration: number;
    overlayClass: string;
    overlayStyle: string;
    background: string;
    transparent: boolean;
    keepRender: boolean;
    overlayClosable: boolean;
    beforeClose: import("./common").PopoutBeforeClose;
    showConfirm: boolean;
    cancelText: string;
    confirmText: string;
    showCancel: boolean;
    confirmDisabled: boolean;
    showClose: boolean;
    showFooter: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
