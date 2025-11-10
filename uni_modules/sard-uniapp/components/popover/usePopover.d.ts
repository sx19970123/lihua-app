import { type NodeRect } from '../../utils';
import { type PopoverContext } from './common';
export interface PopoverController {
    show: (getRect?: () => NodeRect | Promise<NodeRect>) => void;
    _inject: (value: PopoverContext) => void;
}
export declare function usePopover(selector?: string): PopoverController;
