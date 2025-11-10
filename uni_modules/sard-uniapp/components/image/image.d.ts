import { type ImageProps, type ImageSlots } from './common';
declare function __VLS_template(): Readonly<ImageSlots> & ImageSlots;
declare const __VLS_component: import("vue").DefineComponent<ImageProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
    error: (event: any) => any;
    load: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<ImageProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
    onError?: ((event: any) => any) | undefined;
    onLoad?: ((event: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    height: string;
    showError: boolean;
    fade: boolean;
    background: string;
    shape: "circle" | "square";
    src: string;
    iconFamily: string;
    mode: import("./common").ImageMode;
    lazyLoad: boolean;
    webp: boolean;
    showMenuByLongpress: boolean;
    width: string;
    radius: string;
    loadingIcon: string;
    errorIcon: string;
    showLoading: boolean;
    customLoad: (callback: (event: any) => void) => any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
