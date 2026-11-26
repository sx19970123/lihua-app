package uts.sdk.modules.lihuaPow

import android.os.Handler
import android.os.Looper
import java.security.MessageDigest

/**
 * POW 工作量证明原生挖矿（SHA-256 MessageDigest 实现）
 */
object PowMiner {

    // 挖矿结果回主线程用的 handler
    private val mainHandler = Handler(Looper.getMainLooper())

    /**
     * 分片挖矿：从 start 起最多尝试 maxTries 个 nonce，命中返回 nonce，未命中返回 -1
     * 匹配语义与 JS 版 sha256.ts 一致：digest 前 targetHex.length 个 hex 字符与 targetHex 相等
     */
    fun mineSliceKotlin(saltHex : String, targetHex : String, start : Number, maxTries : Number) : Number {
        val bits = targetHex.length * 4
        val fullBytes = bits / 8
        val remBits = bits % 8
        // 奇数个 hex 字符时低位补 0 对齐整字节
        val padded = if (targetHex.length % 2 == 0) targetHex else targetHex + "0"
        val targetBytes = ByteArray(padded.length / 2)
        for (k in targetBytes.indices) {
            targetBytes[k] = ((Character.digit(padded[k * 2], 16) shl 4) or Character.digit(padded[k * 2 + 1], 16)).toByte()
        }
        // 半字节余数掩码：只比较高位 remBits 位（Int 算术后 and 0xFF，remBits=1 时 0xFF shl 7 and 0xFF = 0x80）
        val mask = if (remBits == 0) 0xFF else (0xFF shl (8 - remBits)) and 0xFF
        val md = MessageDigest.getInstance("SHA-256")
        val from = start.toInt()
        val tries = maxTries.toInt()
        for (i in 0 until tries) {
            val digest = md.digest((saltHex + (from + i).toString()).toByteArray(Charsets.US_ASCII))
            var hit = true
            for (j in 0 until fullBytes) {
                if (digest[j] != targetBytes[j]) {
                    hit = false
                    break
                }
            }
            if (hit && remBits > 0 && (digest[fullBytes].toInt() and mask) != (targetBytes[fullBytes].toInt() and mask)) {
                hit = false
            }
            if (hit) {
                return from + i
            }
        }
        return -1
    }

    /**
     * 后台分片挖矿：计算同 mineSliceKotlin，在后台线程执行，结果回主线程回调
     */
    fun mineSliceAsyncKotlin(saltHex : String, targetHex : String, start : Number, maxTries : Number, onDone : (Number) -> Unit) {
        Thread {
            val found = PowMiner.mineSliceKotlin(saltHex, targetHex, start, maxTries)
            mainHandler.post {
                onDone(found)
            }
        }.start()
    }
}
