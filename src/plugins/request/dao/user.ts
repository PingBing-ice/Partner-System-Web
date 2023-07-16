export type updateRequest={
    id: number;
    username?: string;
    gender?: string;
    tags?: string;
    profile?: string;
    email?: string;
    tel?: string;
    status?: string;
    code?: string;
}
export type User={
    id: number;
    username: string;
    userAccount: string;
    avatarUrl: string;
    gender?: string;
    tags?: string;
    profile?: string;
    tel?: string;
    email?: string;
    status?: string;
}

/**
 * 用户类别
 */
export type UserType = {
    id?: string;
    username?: string;
    userAccount?: string;
    avatarUrl?: string;
    gender?: string;
    tel?: string;
    email?: string;
    profile?: string;
    tags?: string;
};
export type UserAvatarVo = {
    id?: string;
    username?: string;
    avatarUrl?: string;
}