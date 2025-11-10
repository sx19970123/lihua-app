import { MaybeRefOrGetter } from 'vue';
export interface UseTimeoutFnOptions {
    immediate?: boolean;
    immediateCallback?: boolean;
}
export declare function useTimeout<CallbackFn extends (...args: any[]) => any>(cb: CallbackFn, interval: MaybeRefOrGetter<number>, options?: UseTimeoutFnOptions): {
    isPending: Readonly<import("vue").ShallowRef<boolean, boolean>>;
    start: (...args: Parameters<CallbackFn> | []) => void;
    stop: () => void;
};
export declare const useSetTimeout: typeof useTimeout;
