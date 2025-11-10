import { type CascaderProps, type CascaderSlots, type CascaderOption } from './common';
declare function __VLS_template(): Readonly<CascaderSlots> & CascaderSlots;
declare const __VLS_component: import("vue").DefineComponent<CascaderProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: string | number | (string | number)[], selectedOptions: any[]) => any;
    change: (value: string | number | (string | number)[], selectedOptions: any[]) => any;
    select: (option: any, tabIndex: number) => any;
}, string, import("vue").PublicProps, Readonly<CascaderProps> & Readonly<{
    "onUpdate:model-value"?: ((value: string | number | (string | number)[], selectedOptions: any[]) => any) | undefined;
    onChange?: ((value: string | number | (string | number)[], selectedOptions: any[]) => any) | undefined;
    onSelect?: ((option: any, tabIndex: number) => any) | undefined;
}>, {
    options: CascaderOption[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
