import { ResponseError } from "@/api/global/Type.ts";
import { getPublicKey } from "@/api/system/auth/Auth.ts";
import { getUUID } from "@/utils/uuid/uuid"
import WxmpRsa from 'wxmp-rsa';

// 密码加密
export const rasEncryptPassword = (password: string): Promise<{ciphertext:string,requestKey:string}> => {
  return new Promise(async (resolve, reject) => {
	// 唯一key
    const requestKey = await getUUID();
	
    // 获取公钥
    const publicKeyResp = await getPublicKey(requestKey);
    if (publicKeyResp.code !== 200) {
      reject(new ResponseError(500, "业务异常"))
    }

    const publicKey = publicKeyResp.data
    // 进行密码加密
    const ciphertext = rsaEncrypt(password, publicKey);
    if (!ciphertext) {
      reject(new ResponseError(500, "业务异常"))
    }

    resolve({
      ciphertext: ciphertext as string,
      requestKey: requestKey
    })
  })
}

// 使用rsa公钥进行数据加密
const rsaEncrypt = (input: string, publicKey: string): string | false => {
  const encryptor = new WxmpRsa();
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(input);
}