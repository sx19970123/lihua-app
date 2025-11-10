import { type StyleValue } from 'vue';
import { type TransitionHookEmits } from '../popup/common';
export interface ShareSheetProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    itemList?: ShareSheetItem[] | ShareSheetItem[][];
    title?: string;
    description?: string;
    cancel?: string;
    visible?: boolean;
    overlayClosable?: boolean;
    beforeClose?: (type: 'close' | 'cancel' | 'select') => boolean | Promise<any>;
    duration?: number;
}
export declare const defaultShareSheetProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string)) | undefined;
    itemList?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => ShareSheetItem[] | ShareSheetItem[][]) | undefined;
    title?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string)) | undefined;
    description?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string)) | undefined;
    cancel?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => boolean)) | undefined;
    overlayClosable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => boolean)) | undefined;
    beforeClose?: (((type: "close" | "cancel" | "select") => boolean | Promise<any>) | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => (type: "close" | "cancel" | "select") => boolean | Promise<any>)) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        itemList: ShareSheetItem[] | ShareSheetItem[][];
        title: string;
        description: string;
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => number)) | undefined;
};
export interface ShareSheetEmits extends TransitionHookEmits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'close'): void;
    (e: 'cancel'): void;
    (e: 'select', item: ShareSheetItem): void;
}
export interface ShareSheetItem {
    name?: string;
    description?: string;
    color?: string;
    background?: string;
    icon?: string;
    iconFamily?: string;
    disabled?: boolean;
}
