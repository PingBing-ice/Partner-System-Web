import myAxios from "../../config/myAxios";
import {response} from "@/plugins/request/dao/type";
import {teamQuery} from "@/plugins/request/dao/TeamQuery";

const searchTeam = async (query: teamQuery|undefined): Promise<response> => {
    return await myAxios.post('/team/search', {
        size: query?.page?.size,
        current: query?.page?.current,
        id: query?.id,
        userId: query?.id,
        maxNum: query?.id,
        status: query?.id,
        searchTxt: query?.id,
        name: query?.id,
        description: query?.id,
    });
}
const getTeamByAv = async (id: number): Promise<response> => {
    return await myAxios.get("/team/name", {
        params: {
            id: id,
        }
    })
}
const join =async (id:number,password:string|null): Promise<response> => {
    return  await myAxios.post("/team/join", {
        teamId: id,
        password: password,
    });
}
const add =async (postData:any): Promise<response> => {
    return  await myAxios.post('/team/addTeam', postData);

}
const check =async (): Promise<response> => {
    return  await myAxios.get("/team/check");
}
export default {
    searchTeam,
    getTeamByAv,
    join,
    add,
    check
}