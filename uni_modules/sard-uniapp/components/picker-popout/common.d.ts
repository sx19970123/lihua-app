import { type StyleValue } from 'vue';
import { type PickerSlots, type PickerProps } from '../picker/common';
import { type TransitionHookEmits } from '../popup/common';
export interface PickerPopoutProps extends PickerProps {
    visible?: boolean;
    title?: string;
    validateEvent?: boolean;
    popoutClass?: string;
    popoutStyle?: StyleValue;
    resettable?: boolean;
}
export declare const defaultPickerPopoutProps: () => {
    visible?: (boolean | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => boolean)) | undefined;
    title?: (string | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => string)) | undefined;
    validateEvent?: (boolean | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => boolean)) | undefined;
    popoutClass?: (string | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => string)) | undefined;
    popoutStyle?: (string | false | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    resettable?: (boolean | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => boolean)) | undefined;
    rootStyle?: string | false | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null | undefined;
    rootClass?: string | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => string) | undefined;
    columns: (props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
    optionKeys?: ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => import("../picker/common").PickerOptionKeys) | undefined;
    modelValue?: any;
    immediateChange?: boolean | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => boolean) | undefined;
    internalCustom?: number | ((props: {
        visible: boolean;
        title: string;
        validateEvent: boolean;
        popoutClass: string;
        popoutStyle: StyleValue;
        resettable: boolean;
        rootStyle: StyleValue;
        rootClass: string;
        columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
        optionKeys: import("../picker/common").PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => number) | undefined;
};
export interface PickerPopoutSlots extends PickerSlots {
}
export interface PickerPopoutEmits extends TransitionHookEmits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'update:model-value', value: any): void;
    (e: 'change', value: any): void;
    (e: 'confirm'): void;
}
export interface PickerPopoutExpose {
}
