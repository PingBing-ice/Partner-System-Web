import myAxios from "@/config/myAxios";

const mathSign = async () => {
    return await myAxios.get("/mathSign");
}
const sign = async () => {
    return await myAxios.get("/sign");
}
const checkSign = async () => {
    return await myAxios.get("/checkSign");
}
export default {
    mathSign,
    sign,
    checkSign
}