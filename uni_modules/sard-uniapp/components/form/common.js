import { inject } from 'vue';
import { defaultConfig } from '../config';
export const defaultFormProps = defaultConfig.form;
export const defaultFormItemProps = () => ({
    ...defaultConfig.formItem,
    required: undefined,
});
export const formContextSymbol = Symbol('form-context');
export const formItemContextSymbol = Symbol('form-item-context');
export function useFormContext() {
    return inject(formContextSymbol, null);
}
export function useFormItemContext() {
    return inject(formItemContextSymbol, null);
}
