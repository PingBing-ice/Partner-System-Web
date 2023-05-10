import myAxios from "../../config/myAxios";
import {LocationQueryValue} from "vue-router";


const getPostList = async ( pageNum: number,pageSize: number, content: string, sorted: number, tagId: string, own: boolean) => {
    return await myAxios.post("/post/list", {
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
const getPostByRecord =async (num:number,size:number) => {
    return await myAxios.post("/post/record",{
        pageSize:size,
        pageNum: num,
    })
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
const getImageList =async (num:number,size:number) => {
    return await myAxios.post("/post/image",{
        pageSize:size,
        pageNum: num,
    })
}
export default {
    getPostList,
    getPostCollect,
    delPost,
    search,
    delComm,
    getImageList,
    getPostByRecord
}