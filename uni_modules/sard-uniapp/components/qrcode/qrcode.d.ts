import { type QrcodeProps } from './common';
declare function __VLS_template(): {
    default?(_: {}): any;
};
declare const __VLS_component: import("vue").DefineComponent<QrcodeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    success: (tempFilePath: string) => any;
}, string, import("vue").PublicProps, Readonly<QrcodeProps> & Readonly<{
    onSuccess?: ((tempFilePath: string) => any) | undefined;
}>, {
    text: string;
    ecl: import("./common").QrcodeECL;
    size: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "canvas" | "image";
    icon: string;
    color: string;
    showMenuByLongpress: boolean;
    canvasSize: number;
    bgColor: string;
    quietZoneModules: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
