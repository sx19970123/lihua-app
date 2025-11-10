import { type SidebarProps, type SidebarSlots } from './common';
declare function __VLS_template(): Readonly<SidebarSlots> & SidebarSlots;
declare const __VLS_component: import("vue").DefineComponent<SidebarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (name: string | number) => any;
    "update:current": (name: string | number) => any;
}, string, import("vue").PublicProps, Readonly<SidebarProps> & Readonly<{
    onChange?: ((name: string | number) => any) | undefined;
    "onUpdate:current"?: ((name: string | number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
