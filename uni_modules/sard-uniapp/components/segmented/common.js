import { defaultConfig } from '../config';
export const defaultOptionKeys = {
    label: 'label',
    value: 'value',
    disabled: 'disabled',
};
export const defaultSegmentedProps = defaultConfig.segmented;
export const segmentedContextSymbol = Symbol('segmented-context');
