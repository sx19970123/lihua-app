import UIKit
import DCloudUniappRuntime

/**
 * 原生遮罩条带：挂在 key window 上，盖住页面内容区之外的区域
 */
public class MaskOverlay {
    // 当前挂着的条带
    private static var strips: [MaskStripView] = []

    /**
     * 挂条带（替换已有）：rects 为 [top, bottom, top, bottom…]（pt，窗口坐标）
     */
    public static func showSwift(rects: Array<NSNumber>, alpha: NSNumber, onTap: @escaping () -> Void) {
        onMain {
            MaskOverlay.removeAll()
            let window = UTSiOS.getKeyWindow()
            let width = window.bounds.width
            var i = 0
            while i + 1 < rects.count {
                let top = CGFloat(rects[i].doubleValue)
                let bottom = CGFloat(rects[i + 1].doubleValue)
                if bottom > top {
                    let view = MaskStripView(frame: CGRect(x: 0, y: top, width: width, height: bottom - top))
                    view.alpha = CGFloat(alpha.doubleValue)
                    view.onTap = onTap
                    window.addSubview(view)
                    MaskOverlay.strips.append(view)
                }
                i += 2
            }
        }
    }

    /**
     * 改全部条带的透明度（0~1）
     */
    public static func setAlphaSwift(alpha: NSNumber) {
        let value = CGFloat(alpha.doubleValue)
        onMain {
            for view in MaskOverlay.strips {
                view.alpha = value
            }
        }
    }

    /**
     * 移除全部条带
     */
    public static func hideSwift() {
        onMain {
            MaskOverlay.removeAll()
        }
    }

    private static func removeAll() {
        for view in MaskOverlay.strips {
            view.removeFromSuperview()
        }
        MaskOverlay.strips.removeAll()
    }

    // 视图操作统一回主线程
    private static func onMain(_ block: @escaping () -> Void) {
        if Thread.isMainThread {
            block()
        } else {
            DispatchQueue.main.async(execute: block)
        }
    }
}

/**
 * 单条遮罩：整条响应触摸，点一下回调
 */
class MaskStripView: UIView {
    var onTap: (() -> Void)? = nil

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = UIColor.black
        addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleTap(_:))))
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc private func handleTap(_ sender: UITapGestureRecognizer) {
        onTap?()
    }
}
