import { type StyleValue } from 'vue';
export interface LoadingProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    type?: 'clock' | 'circular';
    color?: string;
    size?: string;
    text?: string;
    textColor?: string;
    textSize?: string;
    vertical?: boolean;
    animated?: boolean;
    progress?: number;
}
export declare const defaultLoadingProps: () => {
    animated: boolean;
    progress: number;
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => string)) | undefined;
    type?: ("clock" | "circular" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => "clock" | "circular")) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => string)) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => string)) | undefined;
    text?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => string)) | undefined;
    textColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => string)) | undefined;
    textSize?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => string)) | undefined;
    vertical?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "clock" | "circular";
        color: string;
        size: string;
        text: string;
        textColor: string;
        textSize: string;
        vertical: boolean;
        animated: boolean;
        progress: number;
    }) => boolean)) | undefined;
};
export interface LoadingSlots {
    default?(props: Record<string, never>): any;
    circular?(props: Record<string, never>): any;
}
