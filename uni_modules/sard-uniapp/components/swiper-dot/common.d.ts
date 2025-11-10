import { type StyleValue } from 'vue';
export interface SwiperDotProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    type?: 'dot' | 'dot-bar' | 'index' | 'title' | 'fraction';
    current?: number;
    total?: number;
    list?: any[];
    field?: string;
}
export declare const defaultSwiperDotProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "dot" | "dot-bar" | "index" | "title" | "fraction";
        current: number;
        total: number;
        list: any[];
        field: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "dot" | "dot-bar" | "index" | "title" | "fraction";
        current: number;
        total: number;
        list: any[];
        field: string;
    }) => string)) | undefined;
    type?: ("title" | "index" | "dot" | "dot-bar" | "fraction" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "dot" | "dot-bar" | "index" | "title" | "fraction";
        current: number;
        total: number;
        list: any[];
        field: string;
    }) => "title" | "index" | "dot" | "dot-bar" | "fraction")) | undefined;
    current?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "dot" | "dot-bar" | "index" | "title" | "fraction";
        current: number;
        total: number;
        list: any[];
        field: string;
    }) => number)) | undefined;
    total?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "dot" | "dot-bar" | "index" | "title" | "fraction";
        current: number;
        total: number;
        list: any[];
        field: string;
    }) => number)) | undefined;
    list?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "dot" | "dot-bar" | "index" | "title" | "fraction";
        current: number;
        total: number;
        list: any[];
        field: string;
    }) => any[]) | undefined;
    field?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "dot" | "dot-bar" | "index" | "title" | "fraction";
        current: number;
        total: number;
        list: any[];
        field: string;
    }) => string)) | undefined;
};
