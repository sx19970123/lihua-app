import { type ResizeSensorProps, type ResizeSensorSlots } from './common';
declare function __VLS_template(): Readonly<ResizeSensorSlots> & ResizeSensorSlots;
declare const __VLS_component: import("vue").DefineComponent<ResizeSensorProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    resize: (value: import("../../utils").NodeRect) => any;
}, string, import("vue").PublicProps, Readonly<ResizeSensorProps> & Readonly<{
    onResize?: ((value: import("../../utils").NodeRect) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    initial: boolean;
    threshold: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
