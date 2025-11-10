import { type MaybeRef } from 'vue';
export declare function useKeyList<T>(list: MaybeRef<T[]>): import("vue").ComputedRef<{
    data: import("vue").UnwrapRef<T>;
    key: string;
}[]>;
