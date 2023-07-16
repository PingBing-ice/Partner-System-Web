import myAxios from "../../config/myAxios";
import {response} from "@/plugins/request/dao/type";


const getPostListIndex = async (current: number, size: number, scope: string): Promise<response> => {
    return await myAxios.post("/post/index", {
        current: current,
        size: size,
        scope: scope,
    });
}
const addPost = async (file: FormData, message: string, tags: string,groupId:number): Promise<response> => {
    return await myAxios.post("/post/addPost", {
        file: file,
        content: message,
        groupId: groupId,
        tags: tags,
    })
}
const getPostById = async (postId: number): Promise<response> => {
    return await myAxios.get("/post/get", {
        params: {
            postId: postId,
        }
    })
}
const getPostTeamList = async (current: number, size: number, scope: string, tid: number): Promise<response> => {
    return await myAxios.post("/post/team", {
        current: current,
        size: size,
        scope: scope,
        tid: tid,
    });
}
const getPostUerList = async (current: number, size: number, scope: string, tid: number): Promise<response> => {
    return await myAxios.post("/post/user", {
        current: current,
        size: size,
        scope: scope,
        tid: tid,
    });
}
const getPostCollect = async (): Promise<response> => {
    return await myAxios.get("/post/collect")
}
const getPostByRecord = async (num: number, size: number): Promise<response> => {
    return await myAxios.post("/post/record", {
        size: size,
        current: num,
    })
}
const delPost = async (id: number): Promise<response> => {
    return await myAxios.post("/post/delPost", {
        id: id
    })
}
const search = async (userId: number | null, content: string): Promise<response> => {
    return await myAxios.post("/post/search", {
        content: content,
        userId: userId,

    })
}
const delComm = async (commId: number, postId: number): Promise<response> => {
    return await myAxios.post("/post/del", {
        id: commId,
        postId: postId,
    })
}
const getImageList = async (num: number, size: number): Promise<response> => {
    return await myAxios.post("/post/image", {
        size: size,
        current: num,
    })
}
const doThumb = async (id: number): Promise<response> => {
    return await myAxios.post("/post/doThumb", {
        postId: id
    });
}
const doCollect = (id: number): Promise<response> => {
    return myAxios.post("/post/doCollect", {
        postId: id,
    })
}
const doComment = async (content: string, postId: number, replyId: string, userId: number): Promise<response> => {
    return await myAxios.post("/post/doComment", {
        content: content,
        postId: postId,
        replyId: replyId,
        userId: userId,
    })
}
const col = async (): Promise<response> => {
    return  await myAxios.get("/post/col");
}
export default {
    getPostListIndex,
    getPostCollect,
    delPost,
    search,
    delComm,
    getImageList,
    getPostByRecord,
    getPostTeamList,
    doThumb,
    doCollect,
    doComment,
    addPost,
    getPostById,
    getPostUerList,
    col
}