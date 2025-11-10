import { type StepsProps, type StepsSlots } from './common';
declare function __VLS_template(): Readonly<StepsSlots> & StepsSlots;
declare const __VLS_component: import("vue").DefineComponent<StepsProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<StepsProps> & Readonly<{}>, {
    center: boolean;
    reverse: boolean;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    status: import("./common").StepsStatus;
    direction: "vertical" | "horizontal";
    itemList: import("./common").StepsItem[];
    iconSize: string;
    iconFamily: string;
    errorIcon: string;
    current: number;
    finishIcon: string;
    processIcon: string;
    waitIcon: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
