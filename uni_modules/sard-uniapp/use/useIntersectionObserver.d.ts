import { type ComponentInternalInstance, MaybeRef } from 'vue';
interface IntersectionObserverOptions {
    root?: MaybeRef<string>;
    selector?: MaybeRef<string>;
    offsetTop?: MaybeRef<number | undefined>;
    offsetBottom?: MaybeRef<number | undefined>;
    thresholds?: number[];
    initialRatio?: number;
    observeAll?: boolean;
    instance?: ComponentInternalInstance;
}
export declare function useIntersectionObserver(callback: (result: UniApp.ObserveResult) => void, options?: IntersectionObserverOptions): {
    recreate: () => void;
    disconnect: () => void;
};
export {};
