import { type RadioProps, type RadioSlots } from './common';
declare function __VLS_template(): Readonly<RadioSlots> & RadioSlots;
declare const __VLS_component: import("vue").DefineComponent<RadioProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<RadioProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
