import { type StyleValue } from 'vue';
export interface TableProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    bordered?: boolean;
    underline?: boolean;
    height?: string;
}
export declare const defaultTableProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        bordered: boolean;
        underline: boolean;
        height: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        bordered: boolean;
        underline: boolean;
        height: string;
    }) => string)) | undefined;
    bordered?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        bordered: boolean;
        underline: boolean;
        height: string;
    }) => boolean)) | undefined;
    underline?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        bordered: boolean;
        underline: boolean;
        height: string;
    }) => boolean)) | undefined;
    height?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        bordered: boolean;
        underline: boolean;
        height: string;
    }) => string)) | undefined;
};
export interface TableSlots {
    default?(props: Record<string, never>): any;
}
export interface TableContext {
}
export declare const tableContextSymbol: unique symbol;
export interface TableRowProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    fixed?: boolean;
}
export interface TableRowSlots {
    default?(props: Record<string, never>): any;
}
export interface TableCellProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    width?: string;
    bold?: boolean;
    fixed?: boolean | 'left' | 'right';
}
export interface TableCellSlots {
    default?(props: Record<string, never>): any;
}
export interface TableFixationProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    tableWidth?: number;
    scrollY?: boolean;
    height?: string;
    bordered?: boolean;
    underline?: boolean;
}
export interface TableFixationSlots {
    default?(props: Record<string, never>): any;
}
export type TableScrollSide = 'left' | 'middle' | 'right';
export interface TableFixationEmits {
    (e: 'scroll-side', side: TableScrollSide | null): void;
}
