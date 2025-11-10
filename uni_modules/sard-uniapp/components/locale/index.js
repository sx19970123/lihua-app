import { shallowRef, computed, inject, ref, watch, } from 'vue';
import zhCN from './lang/zh-CN';
import { chainGet } from '../../utils';
export const currentLocale = shallowRef(zhCN);
export function useTranslate(prefix = '') {
    const locale = computed(() => {
        return currentLocale.value || zhCN;
    });
    const translate = (chainOrData, data) => {
        const chain = typeof chainOrData === 'string'
            ? prefix
                ? prefix + '.' + chainOrData
                : chainOrData
            : prefix;
        data = chainOrData && typeof chainOrData === 'object' ? chainOrData : data;
        const result = chainGet(locale.value, chain);
        if (typeof result === 'string') {
            if (data) {
                return result.replace(/\${([^}]*)}/g, (_, p1) => {
                    return data[p1];
                });
            }
            return result;
        }
        return chain;
    };
    const select = (chain) => {
        const mergedChain = typeof chain === 'string'
            ? prefix
                ? prefix + '.' + chain
                : chain
            : prefix;
        const result = chainGet(locale.value, mergedChain);
        return result;
    };
    return {
        t: translate,
        translate,
        select,
    };
}
export function setLocale(locale) {
    currentLocale.value = locale;
}
export const localeContextSymbol = Symbol('locale-context');
export function useLocaleProvide(app, languages, defaultLocale) {
    const locale = ref(defaultLocale);
    watch(locale, () => {
        setLocale(languages[locale.value]);
    }, {
        immediate: true,
    });
    app.provide(localeContextSymbol, locale);
}
export function useLocale() {
    return inject(localeContextSymbol);
}
