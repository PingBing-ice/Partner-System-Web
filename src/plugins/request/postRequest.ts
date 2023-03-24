import myAxios from "../myAxios";
import {LocationQueryValue} from "vue-router";


const getPostList = async ( pageNum: number,pageSize: number, content: string, sorted: number, tagId: string, own: boolean) => {
    return await myAxios.post("/post/getPost", {
        content: content,
        pageNum: pageNum,
        pageSize: pageSize,
        sorted: sorted,
        tagId: tagId,
        own: own,
    });
}
const getPostCollect =async () => {
  return await myAxios.get("/post/collect")
}
const delPost =async (id:string) => {
  return await myAxios.post("/post/delPost",{
      id:id
  })
}
const search = async (userId:string,content:string) => {
    return await myAxios.post("/post/search",{
        content: content,
        userId: userId,

    })
}
const delComm =async (commId: string, postId: string | LocationQueryValue[]) => {
  return await myAxios.post("/post/del",{
      id: commId,
      postId: postId,
  })
}
export default {
    getPostList,
    getPostCollect,
    delPost,
    search,
    delComm
}