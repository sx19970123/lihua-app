import { defaultConfig } from '../config';
export const defaultCheckboxProps = defaultConfig.checkbox;
export const defaultOptionKeys = {
    label: 'label',
    value: 'value',
    disabled: 'disabled',
};
export const defaultCheckboxGroupProps = defaultConfig.checkboxGroup;
export const checkboxContextSymbol = Symbol('checkbox-context');
