import { type NotifyProps, type NotifySlots } from './common';
declare function __VLS_template(): Readonly<NotifySlots> & NotifySlots;
declare const __VLS_component: import("vue").DefineComponent<NotifyProps, {
    reHideLater: () => void;
    cancelHide: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<NotifyProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    timeout: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "primary" | "success" | "warning" | "error";
    visible: boolean;
    statusBar: boolean;
    duration: number;
    message: string;
    background: string;
    color: string;
    position: "top" | "bottom";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
