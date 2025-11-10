import { defaultConfig } from '../config';
export const defaultDatetimePickerInputProps = () => ({
    ...defaultConfig.datetimePicker,
    ...defaultConfig.datetimePickerPopout,
    ...defaultConfig.datetimePickerInput,
});
export const mapTypeFormat = {
    y: 'YYYY',
    yM: 'YYYY-MM',
    yMd: 'YYYY-MM-DD',
    yMdh: 'YYYY-MM-DD HH',
    yMdhm: 'YYYY-MM-DD HH:mm',
    yMdhms: 'YYYY-MM-DD HH:mm:ss',
    hm: 'HH:mm',
    hms: 'HH:mm:ss',
};
