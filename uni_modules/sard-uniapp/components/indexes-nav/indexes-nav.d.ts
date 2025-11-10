import { type IndexesNavProps, type IndexesNavSlots } from '../indexes/common';
declare function __VLS_template(): Readonly<IndexesNavSlots> & IndexesNavSlots;
declare const __VLS_component: import("vue").DefineComponent<IndexesNavProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (name: string | number) => any;
}, string, import("vue").PublicProps, Readonly<IndexesNavProps> & Readonly<{
    onSelect?: ((name: string | number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
