import { MaybeRef } from 'vue';
export interface UseFloatingBubbleProps {
    draggable?: boolean;
    gapX: number;
    gapY: number;
    axis: 'x' | 'y' | 'none' | 'both';
    magnet?: 'x' | 'y';
    navbarHeight?: number;
    tabbarHeight?: number;
    offset?: {
        x: number;
        y: number;
    };
}
export interface UseFloatingBubbleEmits {
    (e: 'update:offset', offset: {
        x: number;
        y: number;
    }): void;
}
export interface UseFloatingBubbleOptions {
    disabled?: MaybeRef<boolean>;
}
export declare function useFloatingBubble(props: UseFloatingBubbleProps, emit: UseFloatingBubbleEmits, options?: UseFloatingBubbleOptions): {
    onTouchStart: (event: TouchEvent) => Promise<void>;
    onTouchMove: (event: TouchEvent) => void;
    onTouchEnd: () => void;
    onMouseDown: (event: MouseEvent) => void;
    position: import("vue").Ref<{
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    } | {
        x: number;
        y: number;
    }>;
    initialized: import("vue").Ref<boolean, boolean>;
    animated: import("vue").Ref<boolean, boolean>;
    bubbleId: string;
    stopBubbling: import("vue").Ref<boolean, boolean>;
    windowWidth: number;
    windowHeight: number;
    windowTop: number;
};
