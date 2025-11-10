export interface CountToProps {
    value?: number;
    precision?: number;
    separator?: string;
    separatorDigit?: number;
    duration?: number;
}
export declare const defaultCountToProps: {
    value?: (number | ((props: {
        value: number;
        precision: number;
        separator: string;
        separatorDigit: number;
        duration: number;
    }) => number)) | undefined;
    precision?: (number | ((props: {
        value: number;
        precision: number;
        separator: string;
        separatorDigit: number;
        duration: number;
    }) => number)) | undefined;
    separator?: (string | ((props: {
        value: number;
        precision: number;
        separator: string;
        separatorDigit: number;
        duration: number;
    }) => string)) | undefined;
    separatorDigit?: (number | ((props: {
        value: number;
        precision: number;
        separator: string;
        separatorDigit: number;
        duration: number;
    }) => number)) | undefined;
    duration?: (number | ((props: {
        value: number;
        precision: number;
        separator: string;
        separatorDigit: number;
        duration: number;
    }) => number)) | undefined;
};
