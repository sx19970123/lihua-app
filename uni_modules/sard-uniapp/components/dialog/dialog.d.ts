import { type DialogProps, type DialogSlots } from './common';
import { type ButtonProps } from '../button';
declare function __VLS_template(): Readonly<DialogSlots> & DialogSlots;
declare const __VLS_component: import("vue").DefineComponent<DialogProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<DialogProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    title: string;
    visible: boolean;
    duration: number;
    message: string;
    overlayClosable: boolean;
    beforeClose: import("./common").DialogBeforeClose;
    showConfirm: boolean;
    cancelText: string;
    confirmText: string;
    popupStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    popupClass: string;
    headed: boolean;
    buttonType: "round" | "text";
    showCancel: boolean;
    cancelProps: ButtonProps;
    confirmProps: ButtonProps;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
