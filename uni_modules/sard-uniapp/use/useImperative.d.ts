import { type Ref } from 'vue';
type ImperativeItem<T = any> = {
    show: boolean;
    imperative: T;
};
type AllImperatives<T = any> = Record<string, Record<string, ImperativeItem<T>[] | undefined> | undefined>;
export declare function useImperative<T = any>(name: string, imperative: T, id: Ref<string>): void;
export declare function getAvailableImperative<T = any>(name: string, id: string): T | void;
export declare function getImperatives<T = any>(name: string, id: string): ImperativeItem<T>[] | undefined;
export declare function getAllImperatives<T = any>(): AllImperatives<T>;
export {};
