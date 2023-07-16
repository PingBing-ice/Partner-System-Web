/**
 * 队伍信息
 */
import {UserType} from "./user";

export type TeamType = {
    id: string;
    name: string,
    description?: string,
    expireTime?: string,
    maxNum: number,
    password?: string,
    status: number,
    userVo: UserType[]
};

