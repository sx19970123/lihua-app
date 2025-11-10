import { type AlertProps, type AlertSlots } from './common';
declare function __VLS_template(): Readonly<AlertSlots> & AlertSlots;
declare const __VLS_component: import("vue").DefineComponent<AlertProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: () => any;
}, string, import("vue").PublicProps, Readonly<AlertProps> & Readonly<{
    onClose?: (() => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "primary" | "success" | "warning" | "danger";
    background: string;
    showIcon: boolean;
    closable: boolean;
    color: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
