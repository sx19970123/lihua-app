import { type Ref } from 'vue';
export interface UseLuckyDrawOptions {
    count: number | Ref<number>;
    minSpeed?: number | Ref<number>;
    maxSpeed?: number | Ref<number>;
    accelTime?: number | Ref<number>;
    decelTime?: number | Ref<number>;
    easeIn?: (progress: number) => number;
    easeOut?: (progress: number) => number;
    startDelay?: number | Ref<number>;
    endDelay?: number | Ref<number>;
    complete?: (index: number) => void;
}
export declare const useLuckyDraw: (options: UseLuckyDrawOptions) => {
    play: () => void;
    stop: (index?: number) => void;
    pause: () => void;
    reset: () => void;
    playing: import("vue").ComputedRef<boolean>;
    activeIndex: import("vue").ComputedRef<number | undefined>;
};
export type UseLuckyDrawReturn = ReturnType<typeof useLuckyDraw>;
