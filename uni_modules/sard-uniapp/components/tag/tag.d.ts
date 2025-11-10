import { type TagProps, type TagSlots } from './common';
declare function __VLS_template(): Readonly<TagSlots> & TagSlots;
declare const __VLS_component: import("vue").DefineComponent<TagProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
    close: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<TagProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
    onClose?: ((event: any) => any) | undefined;
}>, {
    size: "small" | "medium" | "large";
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    mark: boolean | "left" | "right";
    closable: boolean;
    color: string;
    textColor: string;
    theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
    round: boolean;
    plain: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
