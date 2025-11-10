import { type SearchProps, type SearchSlots } from './common';
declare function __VLS_template(): Readonly<SearchSlots> & SearchSlots;
declare const __VLS_component: import("vue").DefineComponent<SearchProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<SearchProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    search: string;
    cancel: string;
    focus: boolean;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: string;
    disabled: boolean;
    readonly: boolean;
    background: string;
    shape: "round" | "square";
    placeholder: string;
    inputBackground: string;
    inputColor: string;
    align: "left" | "center" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
