import { type StyleValue } from 'vue';
export interface CascaderFieldKeys {
    label?: string;
    value?: string;
    disabled?: string;
    children?: string;
}
export interface CascaderOption {
    label?: string;
    value?: string | number;
    disabled?: boolean;
    children?: CascaderOption[];
    [key: PropertyKey]: any;
}
export interface CascaderProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    modelValue?: string | number | (string | number)[];
    options?: CascaderOption[];
    fieldKeys?: CascaderFieldKeys;
    hintText?: string;
    labelRender?: (option: CascaderOption) => string;
    changeOnSelect?: boolean;
    allLevels?: boolean;
}
export declare const defaultCascaderProps: {
    options: () => never[];
};
export interface CascaderSlots {
    top?(props: {
        tabIndex: number;
    }): any;
}
export interface CascaderEmits {
    (e: 'update:model-value', value: string | number | (string | number)[], selectedOptions: any[]): void;
    (e: 'change', value: string | number | (string | number)[], selectedOptions: any[]): void;
    (e: 'select', option: any, tabIndex: number): void;
}
export interface CascaderPanel {
    options: CascaderOption[];
    selected: CascaderOption | null;
}
export declare const defaultFieldKeys: CascaderFieldKeys;
export declare function getSelectedOptionsByValue(options: CascaderOption[], value: string | number | (string | number)[], fieldKeys: Required<CascaderFieldKeys>): CascaderOption[] | undefined;
