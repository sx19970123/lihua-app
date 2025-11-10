import { type NavbarProps, type NavbarSlots } from './common';
declare function __VLS_template(): Readonly<NavbarSlots> & NavbarSlots;
declare const __VLS_component: import("vue").DefineComponent<NavbarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    back: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<NavbarProps> & Readonly<{
    onBack?: ((event: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
