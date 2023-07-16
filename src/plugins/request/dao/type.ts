export type PostPageRequest = {
    content?: string,
    current?: number,
    size?: number,
    sorted?: number,
    tagId?: string,
    userId?: number,
    own?: boolean
}
export type response = {
    code?: number;
    data?: any;
    description?: string;
    errorCode?: number;
    message?: string;
}
