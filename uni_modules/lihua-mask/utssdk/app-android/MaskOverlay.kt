package uts.sdk.modules.lihuaMask

import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import io.dcloud.uts.UTSAndroid
import io.dcloud.uts.UTSArray

/**
 * 原生遮罩条带：挂在页面 decorView 上，盖住页面内容区之外的区域
 */
object MaskOverlay {
    // 当前挂着的条带
    private val strips = ArrayList<View>()

    /**
     * 挂条带（替换已有）：rects 为 [top, bottom, top, bottom…]（逻辑 px，窗口坐标）
     */
    fun showKotlin(rects: UTSArray<Number>, alpha: Number, onTap: () -> Unit) {
        val activity = UTSAndroid.getUniActivity()
        if (activity == null) {
            return
        }
        activity.runOnUiThread {
            removeAll()
            val decor = activity.window.decorView as? FrameLayout
            if (decor == null) {
                return@runOnUiThread
            }
            val density = activity.resources.displayMetrics.density
            var i = 0
            while (i + 1 < rects.size) {
                val top = rects[i].toFloat()
                val bottom = rects[i + 1].toFloat()
                if (bottom > top) {
                    val view = View(activity)
                    view.setBackgroundColor(0xFF000000.toInt())
                    view.alpha = alpha.toFloat()
                    view.isClickable = true
                    view.setOnClickListener { onTap() }
                    val params = FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ((bottom - top) * density).toInt())
                    params.topMargin = (top * density).toInt()
                    decor.addView(view, params)
                    strips.add(view)
                }
                i += 2
            }
        }
    }

    /**
     * 改全部条带的透明度（0~1）
     */
    fun setAlphaKotlin(alpha: Number) {
        val activity = UTSAndroid.getUniActivity()
        if (activity == null) {
            return
        }
        val value = alpha.toFloat()
        activity.runOnUiThread {
            for (view in strips) {
                view.alpha = value
            }
        }
    }

    /**
     * 移除全部条带
     */
    fun hideKotlin() {
        val activity = UTSAndroid.getUniActivity()
        if (activity == null) {
            return
        }
        activity.runOnUiThread {
            removeAll()
        }
    }

    private fun removeAll() {
        for (view in strips) {
            (view.parent as? ViewGroup)?.removeView(view)
        }
        strips.clear()
    }
}
