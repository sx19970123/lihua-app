import { type StyleValue } from 'vue';
export interface ProgressBarProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    percent?: number;
    inside?: boolean;
    color?: string;
    trackColor?: string;
    thickness?: string;
    showText?: boolean;
    striped?: boolean;
    animated?: boolean;
    status?: 'success' | 'warning' | 'error';
}
export declare const defaultProgressBarProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    percent?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => number)) | undefined;
    inside?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => boolean)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    trackColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    thickness?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    showText?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => boolean)) | undefined;
    striped?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => boolean)) | undefined;
    animated?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => boolean)) | undefined;
    status?: ("success" | "error" | "warning" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        inside: boolean;
        color: string;
        trackColor: string;
        thickness: string;
        showText: boolean;
        striped: boolean;
        animated: boolean;
        status: "success" | "warning" | "error";
    }) => "success" | "error" | "warning")) | undefined;
};
export interface ProgressBarSlots {
    default?(props: Record<string, never>): any;
}
