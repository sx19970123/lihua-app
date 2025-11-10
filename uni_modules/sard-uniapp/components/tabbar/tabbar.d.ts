import { type TabbarProps, type TabbarSlots } from './common';
declare function __VLS_template(): Readonly<TabbarSlots> & TabbarSlots;
declare const __VLS_component: import("vue").DefineComponent<TabbarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (current: string | number) => any;
    "update:current": (current: string | number) => any;
}, string, import("vue").PublicProps, Readonly<TabbarProps> & Readonly<{
    onChange?: ((current: string | number) => any) | undefined;
    "onUpdate:current"?: ((current: string | number) => any) | undefined;
}>, {
    fixed: boolean;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    color: string;
    safeAreaInsetBottom: boolean;
    bordered: boolean;
    current: number | string;
    activeColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
