import { defaultNotifyProps, } from '../notify/common';
import { defaultConfig } from '../config';
import { getAllImperatives, getAvailableImperative, getImperatives, } from '../../use';
export const defaultNotifyAgentProps = () => ({
    ...defaultNotifyProps,
    ...defaultConfig.notifyAgent,
});
export const imperativeName = 'notify';
const show = (optionsOrMessage, options = {}, internalType) => {
    if (optionsOrMessage && typeof optionsOrMessage === 'object') {
        options = optionsOrMessage;
    }
    else {
        options.message = optionsOrMessage;
    }
    options.type = internalType;
    const { id = defaultConfig.notifyAgent.id } = options;
    const imperative = getAvailableImperative(imperativeName, id);
    if (imperative) {
        imperative.show(options);
    }
};
const notify = (optionsOrMessage, options) => {
    show(optionsOrMessage, options, 'primary');
};
const success = (optionsOrMessage, options) => {
    show(optionsOrMessage, options, 'success');
};
const warning = (optionsOrMessage, options) => {
    show(optionsOrMessage, options, 'warning');
};
const error = (optionsOrMessage, options) => {
    show(optionsOrMessage, options, 'error');
};
const hide = (id = defaultConfig.notifyAgent.id) => {
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
notify.success = success;
notify.warning = warning;
notify.error = error;
notify.hide = hide;
notify.hideAll = hideAll;
export { notify };
