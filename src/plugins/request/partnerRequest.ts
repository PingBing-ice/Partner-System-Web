import myAxios from "@/config/myAxios";

const path = "/partner";
export const getAllRecordList = async (friendId: string) => {
    const response = await myAxios.get(`${path}/chat`, {
        params: {
            friendId: friendId
        }
    });
    return response.data;
}

const friend = "/friend";
export const friendRequest = async (fid: string, message: string) => {
    const response = await myAxios.post(`${friend}/gpt/send`, {
        fid: fid,
        message: message,

    });
    return response.data;
}