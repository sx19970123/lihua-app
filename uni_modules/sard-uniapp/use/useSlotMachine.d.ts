import { type Ref } from 'vue';
import { type UseLuckyDrawOptions } from './useLuckyDraw';
export interface UseSlotMachineOptions extends Omit<UseLuckyDrawOptions, 'count' | 'complete'> {
    columns: number[] | unknown[][] | Ref<number[] | unknown[][]>;
    staggerDelay?: number | Ref<number>;
    complete?: (index: number[]) => void;
}
export declare function useSlotMachine(options: UseSlotMachineOptions): {
    play: () => void;
    stop: (index?: number[]) => void;
    pause: () => void;
    reset: () => void;
    playing: import("vue").ComputedRef<boolean>;
    offset: import("vue").ComputedRef<number[]>;
};
export type UseSlotMachineReturn = ReturnType<typeof useSlotMachine>;
