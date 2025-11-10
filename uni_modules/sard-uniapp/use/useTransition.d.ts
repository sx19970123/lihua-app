export type TransitionHookName = 'before-enter' | 'enter' | 'after-enter' | 'enter-cancelled' | 'before-leave' | 'leave' | 'after-leave' | 'leave-cancelled';
export interface UseTransitionOptions {
    visible?: boolean;
    prefix?: string;
    duration?: number;
    enterFromClass?: string;
    enterActiveClass?: string;
    enterToClass?: string;
    leaveFromClass?: string;
    leaveActiveClass?: string;
    leaveToClass?: string;
    onVisibleHook?: (name: TransitionHookName) => void;
}
export declare function useTransition(options?: UseTransitionOptions): {
    onTransitionEnd: () => void;
    realVisible: import("vue").Ref<boolean, boolean>;
    transitionClass: import("vue").Ref<string, string>;
};
