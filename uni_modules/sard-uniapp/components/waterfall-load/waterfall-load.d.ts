import { type WaterfallLoadProps, type WaterfallLoadSlots } from './common';
declare function __VLS_template(): Readonly<WaterfallLoadSlots> & WaterfallLoadSlots;
declare const __VLS_component: import("vue").DefineComponent<WaterfallLoadProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    load: () => any;
}, string, import("vue").PublicProps, Readonly<WaterfallLoadProps> & Readonly<{
    onLoad?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
