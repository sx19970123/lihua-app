/**
 * WASM 加速版 POW 挖矿（H5/App 端专用，由 index.ts 条件编译引用）
 * iOS WKWebView 与安卓 webview 均支持 WASM（与 Worker 支持无关），单核吞吐为纯 JS 的 5-10 倍；
 * 小程序 iOS 无 WASM（禁 JIT），不引用本文件，走纯 JS 分片
 */
import { createSHA256, type IHasher } from "hash-wasm"

let hasher : IHasher | undefined

/**
 * 初始化 wasm sha256 单例（首次挖矿前调用一次）
 */
export const initWasmMiner = async () => {
  if (!hasher) {
    hasher = await createSHA256()
  }
}

// 输入复用块（salt 16 字节 + nonce 十进制串，恒 ≤55 字节）
const BUF = new Uint8Array(55)

const writeAscii = (offset : number, str : string) => {
  for (let i = 0; i < str.length; i++) {
    BUF[offset + i] = str.charCodeAt(i)
  }
}

// nonce 十进制串写入复用块，返回串长（免每轮字符串分配）
const writeNonce = (offset : number, nonce : number) : number => {
  if (nonce < 10) {
    BUF[offset] = 48 + nonce
    return 1
  }
  let digits = 0
  let n = nonce
  while (n > 0) {
    digits++
    n = (n - n % 10) / 10
  }
  n = nonce
  for (let i = digits - 1; i >= 0; i--) {
    BUF[offset + i] = 48 + n % 10
    n = (n - n % 10) / 10
  }
  return digits
}

/**
 * wasm 版分片挖矿：与纯 JS mineSlice 同签名同语义（hex 前缀匹配）
 */
export const mineSliceWasm = (saltHex : string, targetHex : string, start : number, maxTries : number) : number => {
  if (!hasher) {
    throw new Error('WASM 挖矿未初始化')
  }
  const saltLen = saltHex.length
  writeAscii(0, saltHex)
  for (let i = 0; i < maxTries; i++) {
    const nonce = start + i
    const len = saltLen + writeNonce(saltLen, nonce)
    hasher.init()
    hasher.update(BUF.subarray(0, len))
    if (hasher.digest('hex').startsWith(targetHex)) {
      return nonce
    }
  }
  return -1
}
