import { type OverlayProps, type OverlaySlots } from './common';
declare function __VLS_template(): Readonly<OverlaySlots> & OverlaySlots;
declare const __VLS_component: import("vue").DefineComponent<OverlayProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<OverlayProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    visible: boolean;
    duration: number;
    background: string;
    transparent: boolean;
    zIndex: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
