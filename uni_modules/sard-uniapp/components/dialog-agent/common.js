import { defaultDialogProps, } from '../dialog/common';
import { defaultConfig } from '../config';
import { getAllImperatives, getAvailableImperative, getImperatives, } from '../../use';
export const defaultDialogAgentProps = () => ({
    ...defaultDialogProps,
    ...defaultConfig.dialogAgent,
});
export const imperativeName = 'dialog';
const defaultDialogOptions = {
    headed: false,
    buttonType: 'text',
    showCancel: false,
};
const show = (optionsOrTitle, options = {}, internalOptions) => {
    if (optionsOrTitle && typeof optionsOrTitle === 'object') {
        options = optionsOrTitle;
    }
    else {
        options.title = optionsOrTitle;
    }
    options = Object.assign({}, defaultDialogOptions, options, internalOptions);
    const { id = defaultConfig.dialogAgent.id } = options;
    const imperative = getAvailableImperative(imperativeName, id);
    if (imperative) {
        imperative.show(options);
    }
};
const dialog = (optionsOrTitle, options) => {
    show(optionsOrTitle, options, { showCancel: false });
};
const alert = (optionsOrTitle, options) => {
    show(optionsOrTitle, options, { showCancel: false });
};
const confirm = (optionsOrTitle, options) => {
    show(optionsOrTitle, options, {
        showCancel: true,
    });
};
const hide = (id = defaultConfig.dialogAgent.id) => {
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
dialog.alert = alert;
dialog.confirm = confirm;
dialog.hide = hide;
dialog.hideAll = hideAll;
export { dialog };
