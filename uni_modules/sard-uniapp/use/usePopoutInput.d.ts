import { type TransitionHookName } from './useTransition';
import { type TransitionHookEmits } from '../components/popup/common';
export interface UsePopoutInputProps {
    visible?: boolean;
    modelValue?: any;
    valueOnClear?: () => any;
}
export interface UsePopoutInputEmits extends TransitionHookEmits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'update:model-value', ...args: any[]): void;
    (e: 'change', ...args: any[]): void;
}
export declare function usePopoutInput(props: UsePopoutInputProps, emit: UsePopoutInputEmits, options?: {
    onClear?: (value: any) => void;
}): {
    innerVisible: import("vue").Ref<boolean | undefined, boolean | undefined>;
    innerValue: import("vue").Ref<any, any>;
    inputValue: import("vue").Ref<string, string>;
    show: () => void;
    onChange: (...args: any[]) => void;
    onClear: () => void;
    onVisibleHook: (name: TransitionHookName) => void;
};
