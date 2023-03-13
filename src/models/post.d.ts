import {UserAvatarVo} from "./user";

/**
 * 用户类别
 */
export type PostVoType = {
    id?: string;
    content?: string;
    thumb?: string;
    collect?: string;
    userAvatarVo?: UserAvatarVo;
    tag?: string;
    commentList?: [];
    hasThumb?: boolean;
    hasCollect?: boolean;
    /**
     * private String id;
     *     private String content;
     *     private Integer thumb;
     *     private Integer collect;
     *     private UserAvatarVo userAvatarVo;
     *     private String tag;
     *     private List<String> commentList;
     *     private boolean hasThumb =false;
     *     private boolean hasCollect = false;
     */
};