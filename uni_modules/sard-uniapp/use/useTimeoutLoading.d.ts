import { Ref } from 'vue';
export interface UseTimeoutLoadingOptions {
    leading?: number;
    trailing?: number;
}
export declare function useTimeoutLoading(loading: Ref<boolean>, options?: UseTimeoutLoadingOptions): import("vue").ComputedRef<boolean>;
