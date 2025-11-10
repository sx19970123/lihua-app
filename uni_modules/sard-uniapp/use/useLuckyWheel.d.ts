import { type Ref } from 'vue';
import { type UseLuckyDrawOptions } from './useLuckyDraw';
export interface UseLuckyWheelOptions extends Omit<UseLuckyDrawOptions, 'count'> {
    count?: number | Ref<number>;
}
export declare function useLuckyWheel(options?: UseLuckyWheelOptions): {
    degrees: import("vue").ComputedRef<number>;
    sectorDegrees: import("vue").ComputedRef<number>;
    play: () => void;
    stop: (index?: number) => void;
    pause: () => void;
    reset: () => void;
    playing: import("vue").ComputedRef<boolean>;
};
export type UseLuckyWheelReturn = ReturnType<typeof useLuckyWheel>;
