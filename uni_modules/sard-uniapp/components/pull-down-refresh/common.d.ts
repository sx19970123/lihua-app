import { type StyleValue } from 'vue';
export type PullDownRefreshStatus = 'initial' | 'unready' | 'ready' | 'loading' | 'done' | 'recovering';
export interface PullDownRefreshProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    threshold?: number;
    headerHeight?: number;
    loading?: boolean;
    transitionDuration?: number;
    doneDuration?: number;
    disabled?: boolean;
}
export declare const defaultPullDownRefreshProps: () => {
    loading: boolean;
    disabled: boolean;
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        threshold: number;
        headerHeight: number;
        loading: boolean;
        transitionDuration: number;
        doneDuration: number;
        disabled: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        threshold: number;
        headerHeight: number;
        loading: boolean;
        transitionDuration: number;
        doneDuration: number;
        disabled: boolean;
    }) => string)) | undefined;
    threshold?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        threshold: number;
        headerHeight: number;
        loading: boolean;
        transitionDuration: number;
        doneDuration: number;
        disabled: boolean;
    }) => number)) | undefined;
    headerHeight?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        threshold: number;
        headerHeight: number;
        loading: boolean;
        transitionDuration: number;
        doneDuration: number;
        disabled: boolean;
    }) => number)) | undefined;
    transitionDuration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        threshold: number;
        headerHeight: number;
        loading: boolean;
        transitionDuration: number;
        doneDuration: number;
        disabled: boolean;
    }) => number)) | undefined;
    doneDuration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        threshold: number;
        headerHeight: number;
        loading: boolean;
        transitionDuration: number;
        doneDuration: number;
        disabled: boolean;
    }) => number)) | undefined;
};
export declare const pullDownRefreshProps: {
    rootStyle: (StringConstructor | ObjectConstructor | ArrayConstructor)[];
    rootClass: StringConstructor;
    threshold: {
        type: NumberConstructor;
        default: (number | ((props: {
            rootStyle: StyleValue;
            rootClass: string;
            threshold: number;
            headerHeight: number;
            loading: boolean;
            transitionDuration: number;
            doneDuration: number;
            disabled: boolean;
        }) => number)) | undefined;
    };
    headerHeight: {
        type: NumberConstructor;
        default: (number | ((props: {
            rootStyle: StyleValue;
            rootClass: string;
            threshold: number;
            headerHeight: number;
            loading: boolean;
            transitionDuration: number;
            doneDuration: number;
            disabled: boolean;
        }) => number)) | undefined;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    transitionDuration: {
        type: NumberConstructor;
        default: (number | ((props: {
            rootStyle: StyleValue;
            rootClass: string;
            threshold: number;
            headerHeight: number;
            loading: boolean;
            transitionDuration: number;
            doneDuration: number;
            disabled: boolean;
        }) => number)) | undefined;
    };
    doneDuration: {
        type: NumberConstructor;
        default: (number | ((props: {
            rootStyle: StyleValue;
            rootClass: string;
            threshold: number;
            headerHeight: number;
            loading: boolean;
            transitionDuration: number;
            doneDuration: number;
            disabled: boolean;
        }) => number)) | undefined;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export interface PullDownRefreshSlots {
    default?(props: Record<string, never>): any;
    unready?(props: {
        progress: number;
    }): any;
    ready?(props: Record<string, never>): any;
    loading?(props: Record<string, never>): any;
    done?(props: Record<string, never>): any;
}
export interface PullDownRefreshEmits {
    (e: 'refresh'): void;
}
export interface PullDownRefreshExpose {
    enableToRefresh: (canRefresh: boolean) => void;
    _setStatus: (status: PullDownRefreshStatus) => void;
    _emit: (event: {
        name: Parameters<PullDownRefreshEmits>[0];
        payload?: any;
    }) => void;
    _toRecovering: () => void;
    _toLoading: () => void;
    _setTranslateY: (y: number) => void;
}
