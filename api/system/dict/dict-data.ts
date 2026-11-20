import request from "@/utils/request";
import type {SysDictDataType} from "@/api/system/dict/type/sys-dict-data-type";
import type {MapResponseType} from "@/api/global/type";

export const getDictDataOptionByCodeList = (dictTypeCodeList: string[]) => {
  return request<MapResponseType<SysDictDataType>>({
    url: 'app/system/dictData/option',
    method: 'POST',
    // App 端 uni.request 的 data 仅支持 object/string（裸数组触发 invalid URL 600009），
    // 预序列化字符串直传请求体，后端 @RequestBody List<String> 契约不变
    data: JSON.stringify(dictTypeCodeList)
  })
}
