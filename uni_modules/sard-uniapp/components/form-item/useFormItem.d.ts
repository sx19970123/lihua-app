import { type FormItemProps, type ValidateState } from '../form/common';
export declare function useFormItem(props: FormItemProps): {
    expose: {
        validate: (trigger?: string | string[]) => Promise<void>;
        reset: () => Promise<void>;
        clearValidate: () => void;
        scrollToField: () => Promise<void>;
        validateMessage: import("vue").Ref<string, string>;
        validateState: import("vue").Ref<ValidateState, ValidateState>;
    };
    fieldId: string;
    validateState: import("vue").Ref<ValidateState, ValidateState>;
    shouldShowStar: import("vue").ComputedRef<boolean>;
    validateMessage: import("vue").Ref<string, string>;
    shouldShowError: import("vue").ComputedRef<boolean>;
    direction: import("vue").ComputedRef<"horizontal" | "vertical" | undefined>;
    labelAlign: import("vue").ComputedRef<"start" | "center" | "end" | undefined>;
    labelValign: import("vue").ComputedRef<"start" | "center" | "end" | undefined>;
    starPosition: import("vue").ComputedRef<"left" | "right" | undefined>;
    labelWidth: import("vue").ComputedRef<string | undefined>;
    contentPosition: import("vue").ComputedRef<"left" | "right" | undefined>;
};
