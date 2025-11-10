import { defaultConfig } from '../config';
export const defaultDropdownProps = defaultConfig.dropdown;
export const defaultDropdownItemProps = {
    options: () => [],
};
export const dropdownContextSymbol = Symbol('dropdown-context');
export const defaultValueOnClear = () => undefined;
