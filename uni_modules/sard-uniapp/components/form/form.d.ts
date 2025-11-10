import { type FormProps, type FormSlots } from './common';
declare function __VLS_template(): Readonly<FormSlots> & FormSlots;
declare const __VLS_component: import("vue").DefineComponent<FormProps, {
    validate: (nameList?: import("./common").FieldName[]) => Promise<void>;
    reset: (nameList?: import("./common").FieldName[]) => Promise<void>;
    clearValidate: (nameList?: import("./common").FieldName[]) => Promise<void>;
    scrollToField: (name: import("./common").FieldName) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FormProps> & Readonly<{}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    model: Record<string, any>;
    rules: import("./common").FormRules;
    validateOnRuleChange: boolean;
    direction: "horizontal" | "vertical";
    labelWidth: string;
    labelAlign: "start" | "center" | "end";
    labelValign: "start" | "center" | "end";
    starPosition: "left" | "right";
    contentPosition: "left" | "right";
    hideStar: boolean;
    showError: boolean;
    scrollToFirstError: boolean;
    scrollIntoViewOptions: import("../../utils").ScrollIntoViewOptions;
    scrollDuration: number;
    disabled: boolean;
    readonly: boolean;
    card: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
