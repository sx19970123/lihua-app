import { type PopupProps, type PopupSlots } from './common';
declare const _default: {
    mounted(): void;
};
// export default _default;
declare const _default_1: __VLS_WithTemplateSlots<import("vue").DefineComponent<PopupProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<PopupProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    visible: boolean;
    overlay: boolean;
    duration: number;
    effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
    overlayClass: string;
    overlayStyle: string;
    background: string;
    transparent: boolean;
    keepRender: boolean;
    overlayClosable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, Readonly<PopupSlots> & PopupSlots>;
export default _default_1;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
