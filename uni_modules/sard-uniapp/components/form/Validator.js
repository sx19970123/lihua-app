import { chainGet, isBoolean, isEmptyValue, isFunction, isNumber, isString, toArray, } from '../../utils';
import getUrlRegexp from './getUrlRegexp';
function getMessage(message) {
    return isFunction(message) ? message() : message;
}
function handleRange(len, type, rule) {
    if (isNumber(rule.len)) {
        return len !== rule.len ? `${type}.len` : true;
    }
    else if (isNumber(rule.min) && isNumber(rule.max)) {
        return len < rule.min || len > rule.max ? `${type}.range` : true;
    }
    else if (isNumber(rule.min)) {
        return len < rule.min ? `${type}.min` : true;
    }
    else if (isNumber(rule.max)) {
        return len > rule.max ? `${type}.max` : true;
    }
    else {
        return true;
    }
}
const typeStrategies = {
    string(value, rule) {
        if (isString(value)) {
            return handleRange(value.length, 'string', rule);
        }
        else {
            return false;
        }
    },
    number(value, rule) {
        if (isNumber(value)) {
            return handleRange(value, 'number', rule);
        }
        else {
            return false;
        }
    },
    integer(value, rule) {
        if (Number.isInteger(value)) {
            return handleRange(value, 'number', rule);
        }
        else {
            return false;
        }
    },
    float(value, rule) {
        if (Number.isFinite(value) && value % 1 !== 0) {
            return handleRange(value, 'number', rule);
        }
        else {
            return false;
        }
    },
    boolean(value) {
        return isBoolean(value);
    },
    function(value) {
        return isFunction(value);
    },
    regexp(value) {
        if (isString(value)) {
            try {
                new RegExp(value);
                return true;
            }
            catch {
                return false;
            }
        }
        else {
            return value instanceof RegExp;
        }
    },
    array(value, rule) {
        if (Array.isArray(value)) {
            return handleRange(value.length, 'number', rule);
        }
        else {
            return false;
        }
    },
    object(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    },
    enum(value, rule) {
        return rule.enum?.includes(value) ? true : 'enum';
    },
    date(value) {
        return value instanceof Date;
    },
    url(value) {
        return isString(value) && getUrlRegexp().test(value);
    },
    hex(value) {
        return isString(value) && /^#(?:[0-9A-F]{6}|[0-9A-F]{3})$/i.test(value);
    },
    email(value) {
        return (isString(value) &&
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value));
    },
};
export class Validator {
    validateMessages = undefined;
    setValidateMessages(validateMessages) {
        this.validateMessages = validateMessages;
    }
    getValidTriggerRules(rules, trigger) {
        let validRules = rules;
        if (trigger) {
            const validTrigger = toArray(trigger);
            validRules = rules.filter(Boolean).filter((rule) => {
                let { trigger: ruleTrigger } = rule;
                if (!ruleTrigger) {
                    return true;
                }
                ruleTrigger = toArray(ruleTrigger);
                return validTrigger.some((name) => ruleTrigger.includes(name));
            });
        }
        return validRules;
    }
    validate(rules, options = {}) {
        const { validateFirst, value } = options;
        return new Promise((resolve, reject) => {
            if (validateFirst) {
                Promise.all(rules.map((rule) => {
                    return this.validateRule(value, rule);
                }))
                    .then(() => {
                    resolve();
                })
                    .catch(({ error, rule }) => {
                    reject([this.replaceSymbol(error, rule, options)]);
                });
            }
            else {
                Promise.allSettled(rules.map((rule) => {
                    return this.validateRule(value, rule);
                })).then((values) => {
                    const rejected = values.filter(({ status }) => {
                        return status === 'rejected';
                    });
                    if (rejected.length === 0) {
                        resolve();
                    }
                    else {
                        reject(rejected.map((result) => {
                            const { error, rule } = result.reason;
                            return this.replaceSymbol(error, rule, options);
                        }));
                    }
                });
            }
        });
    }
    validateRule(value, rule) {
        if (rule.transform) {
            value = rule.transform(value);
        }
        return new Promise((resolve, reject) => {
            const handleReject = (error) => {
                reject({
                    error,
                    rule,
                });
            };
            // empty
            const isEmpty = isEmptyValue(value, rule.whitespace);
            if (isEmpty && !rule.validator) {
                if (rule.required) {
                    handleReject(getMessage(rule.message) ||
                        chainGet(this.validateMessages, 'required'));
                }
                else {
                    resolve();
                }
                return;
            }
            // validator
            if (rule.validator) {
                const result = rule.validator(value, rule);
                if (result instanceof Promise) {
                    result
                        .then(() => {
                        resolve();
                    })
                        .catch((error) => {
                        handleReject(error);
                    });
                }
                else if (result === true) {
                    resolve();
                }
                else if (isString(result)) {
                    handleReject(result);
                }
                else {
                    handleReject(getMessage(rule.message));
                }
                return;
            }
            // pattern
            if (rule.pattern instanceof RegExp) {
                const result = rule.pattern.test(String(value));
                if (result) {
                    resolve();
                }
                else {
                    handleReject(getMessage(rule.message) ||
                        chainGet(this.validateMessages, 'pattern.mismatch'));
                }
                return;
            }
            // internal type
            let ruleType = rule.type;
            if (!ruleType &&
                (isNumber(rule.min) || isNumber(rule.max) || isNumber(rule.len))) {
                ruleType = 'string';
            }
            if (ruleType && Object.keys(typeStrategies).includes(ruleType)) {
                this.validateInternal(ruleType, value, rule)
                    .then(() => {
                    resolve();
                })
                    .catch((err) => {
                    handleReject(getMessage(rule.message) || err);
                });
                return;
            }
            resolve();
        });
    }
    validateInternal(type, value, rule) {
        return new Promise((resolve, reject) => {
            const result = typeStrategies[type]?.(value, rule);
            if (result === true) {
                resolve();
            }
            else {
                reject(chainGet(this.validateMessages, isString(result) ? result : `types.${type}`));
            }
        });
    }
    replaceSymbol(string, rule, options = {}) {
        if (string instanceof Error) {
            string = string.message;
        }
        if (!isString(string)) {
            string = String(string);
        }
        const label = isString(options.label) ? options.label : String(options.name);
        const matches = {
            '${min}': rule.min,
            '${max}': rule.max,
            '${len}': rule.len,
            '${enum}': rule.enum,
            '${label}': label,
            '${value}': options.value,
            '${type}': rule.type,
            '${pattern}': rule.pattern?.toString(),
        };
        const regexp = /\$\{(?:min|max|len|enum|label|value|type|pattern)\}/g;
        return string.replace(regexp, (m) => {
            return matches[m] ?? '';
        });
    }
}
