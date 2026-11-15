// crypto-js 为纯 CJS 包在 x 打包器无互操作（运行时 root.CryptoJS 炸），换其 ESM 同源移植 crypto-es（扁平具名导出形态）
import { AES, Utf8, CBC, Pkcs7 } from 'crypto-es'

// 16 字节的 Key
const KEY = Utf8.parse("A1B2C3D4E5F6G7H8")
// 16 字节的 IV
const IV = Utf8.parse("H8G7F6E5D4C3B2A1")

// 加密
export const encrypt = (data: string): string => {
	const encrypted = AES.encrypt(data, KEY, { iv: IV, mode: CBC, padding: Pkcs7 })
	return encrypted.toString()
}

// 解密
export const decrypt = (data: string): string => {
	const decrypted = AES.decrypt(data, KEY, { iv: IV, mode: CBC, padding: Pkcs7 })
	return decrypted.toString(Utf8)
}
