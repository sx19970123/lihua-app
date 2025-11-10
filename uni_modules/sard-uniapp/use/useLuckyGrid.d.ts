import { type Ref } from 'vue';
import { type UseLuckyDrawOptions } from './useLuckyDraw';
export declare function getGridPrizeCount(row: number, column: number): number;
export declare function getGridCenterSize(row: number, column: number): {
    row: number;
    column: number;
};
export declare function getGridIndex(row: number, column: number, index: number): number;
export interface UseLuckyGridOptions extends Omit<UseLuckyDrawOptions, 'count'> {
    row?: number | Ref<number>;
    column?: number | Ref<number>;
}
export declare function useLuckyGrid(options?: UseLuckyGridOptions): {
    activeIndex: import("vue").ComputedRef<number | undefined>;
    grids: import("vue").ComputedRef<number[]>;
    centerSize: import("vue").ComputedRef<{
        row: number;
        column: number;
    }>;
    play: () => void;
    stop: (index?: number) => void;
    pause: () => void;
    reset: () => void;
    playing: import("vue").ComputedRef<boolean>;
};
export type UseLuckyGridReturn = ReturnType<typeof useLuckyGrid>;
