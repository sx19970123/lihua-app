import { type TransitionHookName } from './useTransition';
import { type TransitionHookEmits } from '../components/popup/common';
export interface UseFormPopoutProps {
    visible?: boolean;
    modelValue?: any;
    validateEvent?: boolean;
    resettable?: boolean;
}
export interface UseFormPopoutEmits extends TransitionHookEmits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'update:model-value', ...args: any[]): void;
    (e: 'change', ...args: any[]): void;
    (e: 'confirm'): void;
}
export declare function useFormPopout(props: UseFormPopoutProps, emit: UseFormPopoutEmits, options?: {
    onChange?: (...args: any[]) => void;
    onConfirmBefore?: () => any;
}): {
    innerVisible: import("vue").Ref<boolean | undefined, boolean | undefined>;
    innerValue: import("vue").Ref<any, any>;
    popoutValue: import("vue").Ref<any, any>;
    onChange: (value: any, ...args: any[]) => void;
    onConfirm: (showConfirm?: boolean) => void;
    onVisibleHook: (name: TransitionHookName) => void;
};
