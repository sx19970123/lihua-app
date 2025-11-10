import { type WatermarkProps, type WatermarkSlots } from './common';
declare function __VLS_template(): Readonly<WatermarkSlots> & WatermarkSlots;
declare const __VLS_component: import("vue").DefineComponent<WatermarkProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<WatermarkProps> & Readonly<{}>, {
    offset: [number, number];
    image: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    height: number;
    content: string | string[];
    gap: [number, number];
    width: number;
    zIndex: number;
    rotate: number;
    font: import("./common").WatermarkFont;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
