import { type StyleValue } from 'vue';
import { defaultConfig } from '../config';
export type UploadStatus = 'pending' | 'uploading' | 'failed' | 'done';
export interface UploadFile {
    type: 'image' | 'video';
    size: number;
    path: string;
    duration: number;
    width: number;
    height: number;
    name: string;
}
export interface UploadFileItem {
    file?: UploadFile;
    url?: string;
    isImage?: boolean;
    isVideo?: boolean;
    status?: UploadStatus;
    name?: string;
    message?: string;
    [key: PropertyKey]: any;
}
export interface UploadSelectOptions {
    sourceType?: ('album' | 'camera')[];
}
export interface UploadProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    accept?: 'image' | 'video' | ('image' | 'video')[];
    multiple?: boolean;
    sourceType?: ('album' | 'camera')[];
    sizeType?: ('original' | 'compressed')[];
    maxDuration?: number;
    camera?: 'back' | 'front';
    modelValue?: UploadFileItem[];
    maxCount?: number;
    maxSize?: number | ((file: UploadFile) => boolean);
    overSize?: (fileItem: UploadFileItem[]) => void;
    disabled?: boolean;
    readonly?: boolean;
    beforeChoose?: (fileList: UploadFileItem[], next: (allowed: boolean | UploadSelectOptions) => void) => void;
    beforeRead?: (file: UploadFile) => boolean | Promise<UploadFile>;
    afterRead?: (fileItem: UploadFileItem) => void;
    removable?: boolean;
    beforeRemove?: (index: number, fileItem: UploadFileItem) => boolean | Promise<void>;
    validateEvent?: boolean;
}
export declare const defaultUploadProps: Omit<typeof defaultConfig.upload, "sourceType" | "sizeType" | "accept">;
export interface UploadSlots {
    default?(props: {
        list: UploadFileItem[];
        onSelect: () => void;
        onRemove: (index: number, item: UploadFileItem) => void;
        onImageClick: (index: number) => void;
    }): any;
    select?(props: Record<string, never>): any;
}
export interface UploadEmits {
    (e: 'update:model-value', value: UploadFileItem[]): void;
    (e: 'change', value: UploadFileItem[]): void;
    (e: 'remove', index: number, item: UploadFileItem): void;
    (e: 'item-click', item: UploadFileItem, index: number): void;
}
export interface UploadExpose {
    select: () => void;
}
export interface ChainNode {
    (data: any, next: (...args: any[]) => void): void;
}
export interface UploadPreviewProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    file?: UploadFile;
    url?: string;
    isImage?: boolean;
    isVideo?: boolean;
    status?: UploadStatus;
    name?: string;
    message?: string;
    removable?: boolean;
    index: number;
    disabled?: boolean;
    readonly?: boolean;
}
export declare const defaultUploadPreviewProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => string)) | undefined;
    file?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => UploadFile) | undefined;
    url?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => string)) | undefined;
    isImage?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => boolean)) | undefined;
    isVideo?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => boolean)) | undefined;
    status?: (UploadStatus | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => "done" | "pending" | "uploading" | "failed")) | undefined;
    name?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => string)) | undefined;
    message?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => string)) | undefined;
    removable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => boolean)) | undefined;
    index?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => number)) | undefined;
    disabled?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => boolean)) | undefined;
    readonly?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        file: UploadFile;
        url: string;
        isImage: boolean;
        isVideo: boolean;
        status: UploadStatus;
        name: string;
        message: string;
        removable: boolean;
        index: number;
        disabled: boolean;
        readonly: boolean;
    }) => boolean)) | undefined;
};
export interface UploadPreviewEmits {
    (e: 'image-click'): void;
    (e: 'remove'): void;
    (e: 'click'): void;
}
