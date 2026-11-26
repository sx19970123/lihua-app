import Foundation
import CryptoKit

/**
 * POW 工作量证明原生挖矿（CryptoKit SHA256 实现）
 */
public class PowMiner {

    /**
     * 分片挖矿：从 start 起最多尝试 maxTries 个 nonce，命中返回 nonce，未命中返回 -1
     * 匹配语义与 JS 版 sha256.ts 一致：digest 前 targetHex.length 个 hex 字符与 targetHex 相等
     */
    static func mineSliceSwift(saltHex : String, targetHex : String, start : NSNumber, maxTries : NSNumber) -> NSNumber {
        let bits = targetHex.count * 4
        let fullBytes = bits / 8
        let remBits = bits % 8
        // 奇数个 hex 字符时低位补 0 对齐整字节
        let padded = targetHex.count % 2 == 0 ? targetHex : targetHex + "0"
        var targetBytes = [UInt8](repeating: 0, count: padded.count / 2)
        for k in 0..<(padded.count / 2) {
            let hiIndex = padded.index(padded.startIndex, offsetBy: k * 2)
            let loIndex = padded.index(padded.startIndex, offsetBy: k * 2 + 1)
            targetBytes[k] = (PowMiner.hexNibble(padded[hiIndex]) << 4) | PowMiner.hexNibble(padded[loIndex])
        }
        // 半字节余数掩码：只比较高位 remBits 位（Int 算术后 and 0xFF，remBits=1 时 0xFF << 7 & 0xFF = 0x80）
        let mask : UInt8 = remBits == 0 ? 0xFF : UInt8((0xFF << (8 - remBits)) & 0xFF)
        let from = start.intValue
        let tries = maxTries.intValue
        let saltArray = Array(saltHex.utf8)
        for i in 0..<tries {
            var input = saltArray
            input.append(contentsOf: String(from + i).utf8)
            let bytes = Array(SHA256.hash(data: Data(input)))
            var hit = true
            for j in 0..<fullBytes {
                if bytes[j] != targetBytes[j] {
                    hit = false
                    break
                }
            }
            if hit && remBits > 0 && (bytes[fullBytes] & mask) != (targetBytes[fullBytes] & mask) {
                hit = false
            }
            if hit {
                return NSNumber(value: from + i)
            }
        }
        return NSNumber(value: -1)
    }

    /**
     * 后台分片挖矿：计算同 mineSliceSwift，在后台队列执行，结果回主线程回调
     */
    static func mineSliceAsyncSwift(saltHex : String, targetHex : String, start : NSNumber, maxTries : NSNumber, onDone : @escaping (NSNumber) -> Void) {
        DispatchQueue.global(qos: .userInitiated).async {
            let found = PowMiner.mineSliceSwift(saltHex: saltHex, targetHex: targetHex, start: start, maxTries: maxTries)
            DispatchQueue.main.async {
                onDone(found)
            }
        }
    }

    /**
     * 单个 hex 字符转半字节（输入恒为后端派生的小写 hex）
     */
    static private func hexNibble(_ c : Character) -> UInt8 {
        let ascii = String(c).utf8.first ?? 0
        if ascii >= 97 {
            return ascii - 87
        }
        return ascii - 48
    }
}
