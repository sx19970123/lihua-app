import { type FormItemPlainProps, type FormItemPlainSlots } from '../form-plain/common';
declare function __VLS_template(): Readonly<FormItemPlainSlots> & FormItemPlainSlots;
declare const __VLS_component: import("vue").DefineComponent<FormItemPlainProps, {
    validate: (trigger?: string | string[]) => Promise<void>;
    reset: () => Promise<void>;
    clearValidate: () => void;
    scrollToField: () => void;
    validateMessage: import("vue").Ref<string>;
    validateState: import("vue").Ref<import("../form/common").ValidateState>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FormItemPlainProps> & Readonly<{}>, {
    name: import("../form/common").FieldName;
    error: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    label: string;
    required: boolean;
    rules: import("../form/Validator").Rule | import("../form/Validator").Rule[];
    validateTrigger: import("../form/common").TriggerType;
    direction: "horizontal" | "vertical";
    labelWidth: string;
    labelAlign: "start" | "center" | "end";
    labelValign: "start" | "center" | "end";
    starPosition: "left" | "right";
    contentPosition: "left" | "right";
    hideStar: boolean;
    showError: boolean;
    inlaid: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
