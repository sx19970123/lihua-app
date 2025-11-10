// #defaultConfig
export const defaultConfig = {
    // 全局初始 zIndex
    initialZIndex: 1000,
    /**
     * 设置点击清除按钮后的值
     *
     * - 类型：() => any
     * - 默认值：() = undefined
     *
     * 支持以下组件：
     *
     * - CalendarInput
     * - DatetimePickerInput
     * - DatetimeRangePickerInput
     * - CascaderInput
     * - CheckboxInput
     * - PickerInput
     * - RadioInput
     */
    valueOnClear: undefined,
    actionSheet: {
        overlayClosable: true,
        duration: 250,
    },
    alert: {
        type: 'primary',
    },
    avatar: {
        shape: 'circle',
    },
    avatarGroup: {
        coverage: 0.5,
        showRemain: true,
    },
    backTop: {
        visibleHeight: 200,
    },
    badge: {
        value: 0,
        max: 99,
    },
    button: {
        type: 'default',
        theme: 'primary',
        size: 'medium',
        hoverStopPropagation: false,
        lang: 'en',
        showMessageCard: false,
        block: true,
    },
    calendar: {
        type: 'single',
        maxDays: Number.MAX_SAFE_INTEGER,
        weekStartsOn: 0,
    },
    calendarInput: {
        outletFormat: 'YYYY-MM-DD',
    },
    calendarPopout: {
        showConfirm: true,
        validateEvent: true,
    },
    cascaderPopout: {
        showConfirm: true,
        validateEvent: true,
    },
    cascaderInput: {},
    checkbox: {
        validateEvent: true,
    },
    checkboxGroup: {
        direction: 'vertical',
        validateEvent: true,
    },
    checkboxInput: {},
    checkboxPopout: {
        validateEvent: true,
        iconPosition: 'left',
    },
    coolIcon: {
        shape: 'oval',
    },
    countDown: {
        time: 0,
        autoStart: true,
        format: 'HH:mm:ss',
    },
    countTo: {
        value: 0,
        precision: 0,
        separatorDigit: 3,
        duration: 2000,
    },
    cropImage: {
        duration: 150,
        cropScale: '1:1',
        type: 'png',
        quality: 0.92,
    },
    cropImageAgent: {
        id: 'cropImage',
    },
    datetimePicker: {
        type: 'yMd',
        calendar: 'solar',
    },
    datetimePickerInput: {},
    datetimePickerPopout: {
        validateEvent: true,
    },
    datetimeRangePicker: {
        type: 'yMd',
    },
    datetimeRangePickerInput: {},
    datetimeRangePickerPopout: {
        validateEvent: true,
    },
    dialog: {
        headed: true,
        buttonType: 'round',
        showCancel: true,
        showConfirm: true,
        overlayClosable: true,
        duration: 200,
    },
    dialogAgent: {
        id: 'dialog',
    },
    divider: {
        type: 'solid',
        hairline: true,
        position: 'center',
    },
    dropdown: {
        direction: 'down',
        disabled: false,
        awayClosable: true,
        overlayClosable: true,
        duration: 200,
    },
    empty: {
        icon: 'empty',
    },
    fab: {
        overlayClosable: false,
        hideName: false,
        duration: 150,
        draggable: false,
        axis: 'y',
        gapX: 24,
        gapY: 24,
    },
    floatingBubble: {
        draggable: true,
        axis: 'y',
        gapX: 24,
        gapY: 24,
    },
    floatingPanel: {
        duration: 300,
        contentDraggable: true,
        safeAreaInsetBottom: true,
    },
    form: {
        validateTrigger: 'change',
        validateOnRuleChange: true,
        direction: 'horizontal',
        labelAlign: 'start',
        labelValign: 'center',
        starPosition: 'left',
        contentPosition: 'left',
        showError: true,
        scrollDuration: 150,
    },
    formItem: {
        showError: true,
    },
    grid: {
        columns: 4,
        direction: 'vertical',
    },
    icon: {
        name: '',
        family: 'sari',
        separate: false,
    },
    image: {
        mode: 'aspectFill',
        shape: 'square',
        fade: true,
        loadingIcon: 'image',
        errorIcon: 'image-error',
        showMenuByLongpress: true,
        showLoading: true,
        showError: true,
    },
    indexes: {
        hintDuration: 300,
    },
    input: {
        enableNative: false,
        maxlength: 140,
        adjustPosition: true,
        ignoreCompositionEvent: true,
        showConfirmBar: true,
        disableDefaultPadding: true,
        modelValue: '',
        validateEvent: true,
        cursorSpacing: 30,
        cursor: -1,
        selectionStart: -1,
        selectionEnd: -1,
        inputmode: 'text',
    },
    keyboard: {
        type: 'number',
        mode: 'chinese',
    },
    listItem: {
        arrowDirection: 'right',
    },
    loading: {
        type: 'circular',
    },
    marquee: {
        direction: 'vertical',
        delay: 1000,
        speed: 50,
    },
    noticeBar: {
        delay: 1000,
        speed: 50,
        scrollable: 'auto',
        visible: true,
    },
    notify: {
        type: 'primary',
        position: 'top',
        duration: 250,
        timeout: 3000,
    },
    notifyAgent: {
        id: 'notify',
    },
    overlay: {
        duration: 250,
    },
    pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        pageButtonCount: 5,
        type: 'multi',
        multiCount: 5,
    },
    passwordInput: {
        length: 6,
        type: 'border',
        validateEvent: true,
    },
    picker: {
        immediateChange: false,
    },
    pickerInput: {},
    pickerPopout: {
        validateEvent: true,
    },
    popout: {
        type: 'loose',
        showConfirm: true,
        showClose: true,
        showFooter: true,
        overlay: true,
        overlayClosable: true,
        duration: 250,
    },
    popoutInput: {
        arrow: 'caret-right',
        arrowFamily: 'sari',
    },
    popover: {
        position: 'bottom',
        direction: 'vertical',
        theme: 'light',
        refGap: 10,
        viewportGap: 10,
        transparent: true,
        duration: 150,
    },
    popup: {
        duration: 250,
        effect: 'fade',
        overlay: true,
        overlayClosable: true,
    },
    progressBar: {
        percent: 0,
        showText: true,
    },
    progressCircle: {
        percent: 0,
        thickness: 4,
    },
    pullDownRefresh: {
        threshold: 50,
        headerHeight: 50,
        transitionDuration: 300,
        doneDuration: 0,
    },
    qrcode: {
        ecl: 'M',
        size: '320rpx',
        canvasSize: 400,
        type: 'canvas',
        text: '',
        color: '#000',
        bgColor: '#fff',
        quietZoneModules: 2,
    },
    radioGroup: {
        direction: 'vertical',
        validateEvent: true,
    },
    radioInput: {},
    radioPopout: {
        validateEvent: true,
        type: 'circle',
        iconPosition: 'left',
    },
    rate: {
        count: 5,
        icon: 'star-fill',
        voidIcon: 'star',
        validateEvent: true,
    },
    readMore: {
        maxHeight: 200,
    },
    resizeSensor: {
        threshold: 150,
    },
    result: {
        status: 'info',
    },
    search: {
        shape: 'square',
        focus: false,
    },
    segmented: {
        size: 'middle',
        shape: 'square',
        direction: 'horizontal',
        validateEvent: true,
    },
    shareSheet: {
        overlayClosable: true,
        duration: 250,
    },
    signature: {
        lineWidth: 3,
        fullScreen: false,
        color: '#000',
        duration: 150,
        type: 'png',
        target: 'dataURL',
        quality: 0.92,
    },
    skeleton: {
        rows: 3,
        loading: true,
    },
    slider: {
        min: 0,
        max: 100,
        step: 1,
        validateEvent: true,
    },
    space: {
        direction: 'horizontal',
        size: 'middle',
    },
    statusBar: {},
    stepper: {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
        inputType: 'number',
        press: true,
        pressTime: 350,
        interval: 150,
        validateEvent: true,
        size: 'medium',
    },
    steps: {
        current: 0,
        center: false,
        itemList: () => [],
        direction: 'horizontal',
        finishIcon: 'check-circle-fill',
        processIcon: 'circle',
        waitIcon: 'circle',
        errorIcon: 'x-circle',
    },
    swiperDot: {
        type: 'dot',
        current: 0,
        total: 0,
        field: 'title',
    },
    switch: {
        checkedValue: true,
        uncheckedValue: false,
        validateEvent: true,
    },
    tabbar: {
        bordered: true,
    },
    table: {
        bordered: false,
        underline: false,
    },
    tabs: {
        type: 'line',
    },
    tag: {
        theme: 'default',
        size: 'medium',
    },
    toast: {
        type: 'text',
        position: 'center',
        overlay: false,
        transparent: false,
        timeout: 1500,
        duration: 200,
    },
    toastAgent: {
        id: 'toast',
    },
    tree: {
        defaultExpandAll: false,
        filterMode: 'lenient',
        accordion: false,
    },
    upload: {
        accept: 'image',
        sourceType: () => ['album', 'camera'],
        sizeType: () => ['original', 'compressed'],
        maxDuration: 60,
        maxCount: Number.MAX_SAFE_INTEGER,
        maxSize: Number.MAX_SAFE_INTEGER,
        removable: true,
        validateEvent: true,
    },
    uploadPreview: {
        status: 'pending',
    },
    waterfall: {
        columns: 2,
        columnGap: 16,
        rowGap: 16,
    },
    watermark: {
        width: 120,
        height: 64,
        rotate: -22,
        zIndex: 9,
        gap: () => [30, 30],
    },
};
// #enddefaultConfig
function extendProps(source, target) {
    Object.keys(target).forEach((key) => {
        const sourceValue = source[key];
        const targetValue = target[key];
        if (targetValue !== undefined && targetValue !== null) {
            if (typeof sourceValue !== 'object') {
                source[key] = targetValue;
            }
            else if (typeof targetValue === 'object') {
                extendProps(sourceValue, targetValue);
            }
        }
    });
}
export function setConfig(...optionsArgs) {
    optionsArgs.forEach((options) => {
        extendProps(defaultConfig, options);
    });
}
export function getDurationConfig(duration) {
    return {
        actionSheet: {
            duration,
        },
        dialog: {
            duration,
        },
        dropdown: {
            duration,
        },
        fab: {
            duration,
        },
        notify: {
            duration,
        },
        overlay: {
            duration,
        },
        popout: {
            duration,
        },
        popover: {
            duration,
        },
        popup: {
            duration,
        },
        shareSheet: {
            duration,
        },
        toast: {
            duration,
        },
    };
}
