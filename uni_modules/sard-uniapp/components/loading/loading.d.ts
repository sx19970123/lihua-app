import { type LoadingProps, type LoadingSlots } from './common';
declare function __VLS_template(): Readonly<LoadingSlots> & LoadingSlots;
declare const __VLS_component: import("vue").DefineComponent<LoadingProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<LoadingProps> & Readonly<{}>, {
    text: string;
    size: string;
    progress: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "clock" | "circular";
    vertical: boolean;
    color: string;
    textColor: string;
    textSize: string;
    animated: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
