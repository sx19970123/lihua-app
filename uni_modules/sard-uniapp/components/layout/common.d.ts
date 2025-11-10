import { type StyleValue } from 'vue';
export interface RowProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    gap?: number | string;
    justify?: 'start' | 'center' | 'end' | 'around' | 'between' | 'evenly';
    align?: 'start' | 'center' | 'end' | 'stretch';
}
export interface RowSlots {
    default?(props: Record<string, never>): any;
}
export interface ColProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    span?: number | 'auto' | 'none';
    offset?: number;
    order?: number;
}
export interface ColSlots {
    default?(props: Record<string, never>): any;
}
export type RowContext = {
    gutter: readonly [number, string];
    gap: RowProps['gap'];
};
export declare const rowSymbol: unique symbol;
export declare const mapJustify: {
    start: string;
    center: string;
    end: string;
    around: string;
    between: string;
    evenly: string;
};
export declare const mapAlign: {
    start: string;
    center: string;
    end: string;
    stretch: string;
};
