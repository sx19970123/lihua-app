export interface ValidateMessages {
    default?: string;
    required?: string;
    enum?: string;
    whitespace?: string;
    date?: {
        format?: string;
        parse?: string;
        invalid?: string;
    };
    types?: {
        string?: string;
        function?: string;
        array?: string;
        object?: string;
        number?: string;
        date?: string;
        boolean?: string;
        integer?: string;
        float?: string;
        regexp?: string;
        email?: string;
        url?: string;
        hex?: string;
    };
    string?: {
        len?: string;
        min?: string;
        max?: string;
        range?: string;
    };
    number?: {
        len?: string;
        min?: string;
        max?: string;
        range?: string;
    };
    array?: {
        len?: string;
        min?: string;
        max?: string;
        range?: string;
    };
    pattern?: {
        mismatch?: string;
    };
}
export interface Rule {
    validator?: (value: any, rule: Rule) => Promise<any> | boolean | string | undefined;
    pattern?: RegExp;
    message?: string | (() => string);
    trigger?: string | string[];
    transform?: (value: any) => any;
    type?: keyof typeof typeStrategies;
    enum?: (string | number)[];
    len?: number;
    max?: number;
    min?: number;
    required?: boolean;
    whitespace?: boolean;
}
export interface ValidateOptions {
    validateFirst?: boolean;
    value?: any;
    name?: string | number | (string | number)[];
    label?: string;
    trigger?: string | string[];
}
export type VdaliteFailResult = string[];
declare const typeStrategies: {
    string(value: any, rule: Rule): string | boolean;
    number(value: any, rule: Rule): string | boolean;
    integer(value: any, rule: Rule): string | boolean;
    float(value: any, rule: Rule): string | boolean;
    boolean(value: any): value is boolean;
    function(value: any): value is (...args: any[]) => any;
    regexp(value: any): boolean;
    array(value: any, rule: Rule): string | boolean;
    object(value: any): any;
    enum(value: any, rule: Rule): true | "enum";
    date(value: any): value is Date;
    url(value: any): boolean;
    hex(value: any): boolean;
    email(value: any): boolean;
};
export declare class Validator {
    protected validateMessages: ValidateMessages | undefined;
    setValidateMessages(validateMessages: ValidateMessages): void;
    getValidTriggerRules(rules: Rule[], trigger?: string | string[]): Rule[];
    validate(rules: Rule[], options?: ValidateOptions): Promise<void>;
    protected validateRule(value: any, rule: Rule): Promise<void>;
    protected validateInternal(type: keyof typeof typeStrategies, value: any, rule: Rule): Promise<void>;
    protected replaceSymbol(string: string | Error, rule: Rule, options?: ValidateOptions): string;
}
export {};
