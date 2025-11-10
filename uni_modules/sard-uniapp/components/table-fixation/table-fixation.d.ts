import { type TableFixationProps, type TableFixationSlots, type TableScrollSide } from '../table/common';
declare function __VLS_template(): Readonly<TableFixationSlots> & TableFixationSlots;
declare const __VLS_component: import("vue").DefineComponent<TableFixationProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "scroll-side": (side: TableScrollSide | null) => any;
}, string, import("vue").PublicProps, Readonly<TableFixationProps> & Readonly<{
    "onScroll-side"?: ((side: TableScrollSide | null) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
