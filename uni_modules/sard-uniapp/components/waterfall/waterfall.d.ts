import { type WaterfallProps, type WaterfallSlots } from './common';
declare function __VLS_template(): Readonly<WaterfallSlots> & WaterfallSlots;
declare const __VLS_component: import("vue").DefineComponent<WaterfallProps, {
    reflow: () => void;
    onLoad: (handler: () => void) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    load: () => any;
    loadstart: () => any;
}, string, import("vue").PublicProps, Readonly<WaterfallProps> & Readonly<{
    onLoad?: (() => any) | undefined;
    onLoadstart?: (() => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    columns: number;
    columnGap: number;
    rowGap: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
