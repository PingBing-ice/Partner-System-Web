import myAxios from "../myAxios";

const getImageCode =async () => {
    return await myAxios.get('/captchaImage')
}
export default {
    getImageCode,
};