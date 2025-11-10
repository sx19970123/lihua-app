import { type StyleValue } from 'vue';
export interface ResultProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    status?: 'success' | 'info' | 'warning' | 'error' | 'question';
    icon?: string;
    iconFamily?: string;
    iconColor?: string;
    title?: string;
    description?: string;
}
export declare const defaultResultProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => string)) | undefined;
    status?: ("success" | "error" | "warning" | "info" | "question" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => "success" | "error" | "warning" | "info" | "question")) | undefined;
    icon?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => string)) | undefined;
    iconFamily?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => string)) | undefined;
    iconColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => string)) | undefined;
    title?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => string)) | undefined;
    description?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        status: "success" | "info" | "warning" | "error" | "question";
        icon: string;
        iconFamily: string;
        iconColor: string;
        title: string;
        description: string;
    }) => string)) | undefined;
};
export interface ResultSlots {
    default?(props: Record<string, never>): any;
    title?(props: Record<string, never>): any;
    description?(props: Record<string, never>): any;
    icon?(props: Record<string, never>): any;
}
export declare const mapStatusIcon: {
    success: string;
    info: string;
    warning: string;
    error: string;
    question: string;
};
