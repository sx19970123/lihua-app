import { type DividerProps, type DividerSlots } from './common';
declare function __VLS_template(): Readonly<DividerSlots> & DividerSlots;
declare const __VLS_component: import("vue").DefineComponent<DividerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<DividerProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "solid" | "dashed" | "dotted";
    vertical: boolean;
    hairline: boolean;
    position: "left" | "right" | "center";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
