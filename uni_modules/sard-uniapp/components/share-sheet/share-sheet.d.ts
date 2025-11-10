import { type ShareSheetProps, type ShareSheetItem } from './common';
declare const _default: import("vue").DefineComponent<ShareSheetProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<ShareSheetProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    cancel: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    title: string;
    description: string;
    visible: boolean;
    duration: number;
    overlayClosable: boolean;
    itemList: ShareSheetItem[] | ShareSheetItem[][];
    beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
