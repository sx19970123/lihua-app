import { type UploadPreviewProps } from '../upload/common';
declare const _default: import("vue").DefineComponent<UploadPreviewProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: () => any;
    remove: () => any;
    "image-click": () => any;
}, string, import("vue").PublicProps, Readonly<UploadPreviewProps> & Readonly<{
    onClick?: (() => any) | undefined;
    onRemove?: (() => any) | undefined;
    "onImage-click"?: (() => any) | undefined;
}>, {
    file: import("../upload/common").UploadFile;
    name: string;
    url: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    message: string;
    status: import("../upload/common").UploadStatus;
    disabled: boolean;
    readonly: boolean;
    index: number;
    isImage: boolean;
    isVideo: boolean;
    removable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
