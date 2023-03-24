import myAxios from "../myAxios";

const searchTeam =async (txt:string) => {
    return  await myAxios.get('/partner/team/search', {
        params: {
            searchTxt: txt
        }
    });
}
export default {
    searchTeam
}