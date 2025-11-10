import { type StyleValue } from 'vue';
export interface SkeletonProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    rows?: number;
    title?: boolean;
    avatar?: boolean;
    avatarSize?: string;
    avatarRound?: boolean;
    round?: boolean;
    loading?: boolean;
    animated?: boolean;
}
export declare const defaultSkeletonProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => string)) | undefined;
    rows?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => number)) | undefined;
    title?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => boolean)) | undefined;
    avatar?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => boolean)) | undefined;
    avatarSize?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => string)) | undefined;
    avatarRound?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => boolean)) | undefined;
    round?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => boolean)) | undefined;
    loading?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => boolean)) | undefined;
    animated?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        rows: number;
        title: boolean;
        avatar: boolean;
        avatarSize: string;
        avatarRound: boolean;
        round: boolean;
        loading: boolean;
        animated: boolean;
    }) => boolean)) | undefined;
};
export interface SkeletonSlots {
    default?(props: Record<string, never>): any;
}
export interface SkeletonBlockProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    animated?: boolean;
    round?: boolean;
    width?: string;
    height?: string;
}
export interface SkeletonAvatarProps extends SkeletonBlockProps {
    size?: string;
}
export interface SkeletonParagraphProps extends SkeletonBlockProps {
    rows?: number;
}
export interface SkeletonTitleProps extends SkeletonBlockProps {
}
