/**
 * uni boundingClientRect的 Promise 版本
 * @param selector 组件选择器
 * @param instance 父组件实例
 * @returns Promise<NodeRect>
 */
export function getBoundingClientRect(selector, instance) {
    return new Promise((resolve) => {
        let selectorQuery = uni.createSelectorQuery();
        // #ifndef MP-ALIPAY
        const proxy = instance?.proxy;
        if (proxy) {
            selectorQuery = selectorQuery.in(proxy);
        }
        // #endif
        selectorQuery
            .select(selector)
            .boundingClientRect((data) => {
            resolve(data);
        })
            .exec();
    });
}
/**
 * 获取可使用窗口尺寸
 */
export function getWindowInfo() {
    const windowInfo = uni.getWindowInfo?.();
    if (windowInfo && windowInfo.safeAreaInsets) {
        return windowInfo;
    }
    const info = uni.getSystemInfoSync();
    const { pixelRatio, screenWidth, screenHeight, windowWidth, windowHeight, statusBarHeight = 0, windowTop = 0, windowBottom = 0, } = info;
    const safeArea = info.safeArea || windowInfo.safeArea;
    return {
        pixelRatio,
        screenWidth,
        screenHeight,
        windowWidth,
        windowHeight,
        statusBarHeight,
        windowTop,
        windowBottom,
        safeArea,
        safeAreaInsets: {
            top: safeArea.top,
            bottom: screenHeight - safeArea.bottom,
            left: safeArea.left,
            right: screenWidth - safeArea.right,
        },
        screenTop: 0,
    };
}
/**
 * 获取可使用窗口尺寸、滚动信息
 */
export function getViewportScrollInfo() {
    return new Promise((resolve) => {
        uni
            .createSelectorQuery()
            .selectViewport()
            .scrollOffset((res) => {
            resolve(res);
        })
            .exec();
    });
}
export function toTouchEvent(event) {
    if (!('touches' in event)) {
        const { windowTop } = getWindowInfo();
        const touches = [
            {
                clientX: event.clientX,
                clientY: event.clientY - windowTop,
                pageY: event.pageY,
                pageX: event.pageX,
            },
        ];
        event.changedTouches = touches;
        event.touches = event.type === 'mouseup' ? [] : touches;
    }
    return event;
}
export function getNode(selector, instance) {
    return new Promise((resolve) => {
        uni
            .createSelectorQuery()
            .in(instance?.proxy)
            .select(selector)
            .node((res) => {
            resolve(res?.node);
        })
            .exec();
    });
}
