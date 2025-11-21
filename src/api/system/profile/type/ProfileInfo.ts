import type { AvatarType } from "@/api/system/profile/type/AvatarType";

/**
 * 个人设置用户信息
 */
export interface ProfileInfo {
    avatar?: AvatarType,
    nickname?: string,
    gender?: string,
    email?: string,
    phoneNumber?: string
}