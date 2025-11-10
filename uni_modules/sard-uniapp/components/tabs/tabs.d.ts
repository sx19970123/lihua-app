import { type TabsProps, type TabsSlots } from './common';
declare function __VLS_template(): Readonly<TabsSlots> & TabsSlots;
declare const __VLS_component: import("vue").DefineComponent<TabsProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (name: string | number | boolean) => any;
    "update:current": (name: string | number | boolean) => any;
}, string, import("vue").PublicProps, Readonly<TabsProps> & Readonly<{
    onChange?: ((name: string | number | boolean) => any) | undefined;
    "onUpdate:current"?: ((name: string | number | boolean) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "line" | "pill" | "card";
    scrollable: boolean;
    current: string | number | boolean;
    list: import("./common").TabOption[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
