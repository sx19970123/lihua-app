import { type ProgressCircleProps, type ProgressCircleSlots } from './common';
declare function __VLS_template(): Readonly<ProgressCircleSlots> & ProgressCircleSlots;
declare const __VLS_component: import("vue").DefineComponent<ProgressCircleProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProgressCircleProps> & Readonly<{}>, {
    size: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    status: "success" | "warning" | "error";
    color: string;
    percent: number;
    trackColor: string;
    thickness: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
