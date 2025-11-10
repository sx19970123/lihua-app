import { type BackTopProps, type BackTopSlots } from './common';
declare function __VLS_template(): Readonly<BackTopSlots> & BackTopSlots;
declare const __VLS_component: import("vue").DefineComponent<BackTopProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<BackTopProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    right: string;
    scrollTop: number;
    visibleHeight: number;
    bottom: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
