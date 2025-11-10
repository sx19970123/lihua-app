import { MaybeRef, type Ref } from 'vue';
export declare function useIndeterminate(value: Ref<any[]>, options: MaybeRef<{
    label: any;
    value: any;
    disabled?: boolean;
}[]>): {
    allChecked: Ref<boolean, boolean>;
    isIndeterminate: import("vue").ComputedRef<boolean>;
    onAllChange: (checked: boolean) => void;
};
