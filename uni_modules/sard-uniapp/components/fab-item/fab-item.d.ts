import { type FabItemProps, type FabItemSlots } from './common';
declare function __VLS_template(): Readonly<FabItemSlots> & FabItemSlots;
declare const __VLS_component: import("vue").DefineComponent<FabItemProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<FabItemProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
