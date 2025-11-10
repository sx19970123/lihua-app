import { getAllImperatives, getAvailableImperative, getImperatives, } from '../../use';
import { defaultConfig } from '../config';
import { defaultToastProps, } from '../toast/common';
export const defaultToastAgentProps = () => ({
    ...defaultToastProps,
    ...defaultConfig.toastAgent,
});
export const imperativeName = 'toast';
const show = (optionsOrTitle, options = {}, internalType) => {
    if (optionsOrTitle && typeof optionsOrTitle === 'object') {
        options = optionsOrTitle;
    }
    else {
        options.title = optionsOrTitle;
    }
    options.type = internalType;
    const { id = defaultConfig.toastAgent.id } = options;
    const imperative = getAvailableImperative(imperativeName, id);
    if (imperative) {
        imperative.show(options);
    }
};
const toast = (optionsOrTitle, options) => {
    show(optionsOrTitle, options, 'text');
};
const success = (optionsOrTitle, options) => {
    show(optionsOrTitle, options, 'success');
};
const fail = (optionsOrTitle, options) => {
    show(optionsOrTitle, options, 'fail');
};
const loading = (optionsOrTitle, options) => {
    show(optionsOrTitle, options, 'loading');
};
const hide = (id = defaultConfig.toastAgent.id) => {
    const imperatives = getImperatives(imperativeName, id);
    if (imperatives && imperatives.length > 0) {
        imperatives.forEach((item) => {
            item.imperative.hide();
        });
    }
};
const hideAll = () => {
    const mapImperatives = getAllImperatives()[imperativeName];
    if (mapImperatives) {
        Object.keys(mapImperatives).forEach(hide);
    }
};
toast.success = success;
toast.fail = fail;
toast.loading = loading;
toast.hide = hide;
toast.hideAll = hideAll;
export { toast };
