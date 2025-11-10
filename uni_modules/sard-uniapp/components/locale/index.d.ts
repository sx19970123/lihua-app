import { type App, type InjectionKey, type Ref } from 'vue';
export declare const currentLocale: import("vue").ShallowRef<Record<string, any>, Record<string, any>>;
export interface LocaleTranslate {
    (chainOrData?: string | Record<string, number | string>, data?: Record<string, number | string>): string;
}
export declare function useTranslate(prefix?: string): {
    t: LocaleTranslate;
    translate: LocaleTranslate;
    select: (chain?: string) => any;
};
export declare function setLocale(locale: Record<string, any>): void;
export declare const localeContextSymbol: InjectionKey<Ref<string>>;
export declare function useLocaleProvide<T extends Record<string, any>>(app: App, languages: T, defaultLocale: keyof T): void;
export declare function useLocale(): Ref<string, string> | undefined;
