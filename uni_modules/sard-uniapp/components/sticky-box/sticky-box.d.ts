import { type StickyBoxProps, type StickyBoxSlots } from './common';
declare function __VLS_template(): Readonly<StickyBoxSlots> & StickyBoxSlots;
declare const __VLS_component: import("vue").DefineComponent<StickyBoxProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<StickyBoxProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
