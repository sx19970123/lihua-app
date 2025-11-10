import { type StyleValue } from 'vue';
import { type TransitionHookEmits } from '../popup/common';
export interface ActionSheetProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    description?: string;
    itemList?: ActionSheetItem[];
    cancel?: string;
    visible?: boolean;
    overlayClosable?: boolean;
    beforeClose?: (type: 'close' | 'cancel' | 'select') => boolean | Promise<any>;
    duration?: number;
}
export declare const defaultActionSheetProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string)) | undefined;
    description?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string)) | undefined;
    itemList?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => ActionSheetItem[]) | undefined;
    cancel?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => string)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => boolean)) | undefined;
    overlayClosable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => boolean)) | undefined;
    beforeClose?: (((type: "close" | "cancel" | "select") => boolean | Promise<any>) | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => (type: "close" | "cancel" | "select") => boolean | Promise<any>)) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        itemList: ActionSheetItem[];
        cancel: string;
        visible: boolean;
        overlayClosable: boolean;
        beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
        duration: number;
    }) => number)) | undefined;
};
export interface ActionSheetEmits extends TransitionHookEmits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'close'): void;
    (e: 'cancel'): void;
    (e: 'select', item: ActionSheetItem, index: number): void;
}
export interface ActionSheetItem {
    name?: string;
    description?: string;
    color?: string;
    loading?: boolean;
    disabled?: boolean;
}
