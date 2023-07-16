
/**
 * 用户类别
 */
export type PostVoType = {
    id?: number;
    groupId: number;
    content?: string;
    thumb?: number;
    collect?: number;
    userVo?: PostUserVo;
    tag?: string;
    commentList?: CommentVo[];
    hasThumb?: boolean;
    hasCollect?: boolean;
    createTime: string;
};
export type PostUserVo = {
    thumbTotal?: number
    postTotal?: number
    joinTime?: string
    id?: number
    username?: string
    avatarUrl?: string;
}
export type CommentVo={
    postId?: number;
    commentId?: number;
    content?: string;
    createTime?: string;
    owner?: PostUserVo;
    com?: boolean;
}
