import request from "@/utils/Request.ts"
import type {SysNoticeVO} from "@/api/system/notice/type/SysNotice";

/**
 * 查询预览
 * @param id
 */
export const preview = (id: string) => {
    return request<SysNoticeVO>({
        url: "/system/notice/preview/" + id,
        method: "GET"
    })
}

/**
 * 消息通知添加取消 star
 * @param noticeId
 * @param star
 */
export const star = (noticeId: string, star: string) => {
    return request({
        url: '/system/notice/star/' + noticeId + '/' + star,
        method: 'POST'
    })
}

/**
 * 消息通知设置已读
 * @param noticeId
 */
export const read = (noticeId: string) => {
    return request({
        url: '/system/notice/read/' + noticeId,
        method: 'POST'
    })
}

/**
 * 获取未读消息总数
 */
export const queryUnReadCount = () => {
    return request<number>({
        url: '/system/notice/unread/count',
        method: 'GET'
    })
}
