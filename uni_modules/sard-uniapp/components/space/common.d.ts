import { type StyleValue } from 'vue';
export type SpaceSize = 'small' | 'middle' | 'large';
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
export type SpaceJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export interface SpaceProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    direction?: 'vertical' | 'horizontal';
    size?: SpaceSize | (string & {});
    align?: SpaceAlign | (string & {});
    justify?: SpaceJustify | (string & {});
    wrap?: boolean;
}
export declare const spaceSizes: string[];
export declare const spaceMapAlign: Record<string, string>;
export declare const spaceMapJustify: Record<string, string>;
export declare const defaultSpaceProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        size: SpaceSize | (string & {});
        align: SpaceAlign | (string & {});
        justify: SpaceJustify | (string & {});
        wrap: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        size: SpaceSize | (string & {});
        align: SpaceAlign | (string & {});
        justify: SpaceJustify | (string & {});
        wrap: boolean;
    }) => string)) | undefined;
    direction?: ("horizontal" | "vertical" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        size: SpaceSize | (string & {});
        align: SpaceAlign | (string & {});
        justify: SpaceJustify | (string & {});
        wrap: boolean;
    }) => "horizontal" | "vertical")) | undefined;
    size?: ((string & {}) | SpaceSize | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        size: SpaceSize | (string & {});
        align: SpaceAlign | (string & {});
        justify: SpaceJustify | (string & {});
        wrap: boolean;
    }) => string)) | undefined;
    align?: ((string & {}) | SpaceAlign | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        size: SpaceSize | (string & {});
        align: SpaceAlign | (string & {});
        justify: SpaceJustify | (string & {});
        wrap: boolean;
    }) => string)) | undefined;
    justify?: ((string & {}) | SpaceJustify | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        size: SpaceSize | (string & {});
        align: SpaceAlign | (string & {});
        justify: SpaceJustify | (string & {});
        wrap: boolean;
    }) => string)) | undefined;
    wrap?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        size: SpaceSize | (string & {});
        align: SpaceAlign | (string & {});
        justify: SpaceJustify | (string & {});
        wrap: boolean;
    }) => boolean)) | undefined;
};
export interface SpaceSlots {
    default?(props: Record<string, never>): any;
}
