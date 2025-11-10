import { type StyleValue } from 'vue';
export interface ProgressCircleProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    percent?: number;
    color?: string;
    trackColor?: string;
    thickness?: number;
    size?: string;
    status?: 'success' | 'warning' | 'error';
}
export declare const defaultProgressCircle: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    percent?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => number)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    trackColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    thickness?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => number)) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => string)) | undefined;
    status?: ("success" | "error" | "warning" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        percent: number;
        color: string;
        trackColor: string;
        thickness: number;
        size: string;
        status: "success" | "warning" | "error";
    }) => "success" | "error" | "warning")) | undefined;
};
export interface ProgressCircleSlots {
    default?(props: Record<string, never>): any;
}
