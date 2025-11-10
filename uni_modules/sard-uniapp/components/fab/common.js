import { defaultConfig } from '../config';
export const defaultFabProps = () => ({
    ...defaultConfig.fab,
    itemList: () => [],
});
export const fabContextSymbol = Symbol('fab-context');
