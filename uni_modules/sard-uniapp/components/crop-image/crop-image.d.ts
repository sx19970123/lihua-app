import { type CropImageProps, type CropImageSlots } from './common';
declare function __VLS_template(): Readonly<CropImageSlots> & CropImageSlots;
declare const __VLS_component: import("vue").DefineComponent<CropImageProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<CropImageProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    complete: () => void;
    success: (filePath: string) => void;
    fail: (err: any) => void;
    cancel: () => void;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "png" | "jpg";
    visible: boolean;
    id: string;
    duration: number;
    src: string;
    cropScale: string;
    quality: number;
    beforeCrop: (width: number, height: number) => number;
    cancelText: string;
    confirmText: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
