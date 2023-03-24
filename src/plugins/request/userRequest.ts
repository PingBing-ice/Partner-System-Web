import myAxios from "../myAxios";

const getUserList =async (page: number,size:number) => {
  return  await myAxios.get('/api/user/recommend', {
    params: {
      current: page,
      size: size
    }
  });
}
const search =async (pageNum:number,size:number,name:string) => {

  return  await myAxios.post('/api/user/search', {
    pageNum: pageNum,
    pageSize: size,
    userName: name
  });
}
export default {
  getUserList,
  search
}