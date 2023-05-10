import myAxios from "../../config/myAxios";

const getImageCode =async () => {
    return await myAxios.get('/captchaImage')
}

export default {
    getImageCode,
};