import request from "@/utils/Request";
import type {SysDictDataType} from "@/api/system/dict/type/SysDictDataType";
import type {MapResponseType} from "@/api/global/Type";

/**
 * 根据字典类型编码获取字典数据
 * @param dictTypeCode
 */
export const getDictDataOption = (dictTypeCode: string) => {
  return request<Array<SysDictDataType>>({
    url: 'system/dictData/option/' + dictTypeCode,
    method: 'GET'
  })
}


export const getDictDataOptionByCodeList = (dictTypeCodeList: string[]) => {
  return request<MapResponseType<string, SysDictDataType>>({
    url: 'system/dictData/option',
    method: 'POST',
    data: dictTypeCodeList
  })
}