import axios from "axios";

export const foodplaceApi = axios.create({
    // baseURL: 'http://127.0.0.1:5000/api'
    baseURL: 'https://carlosrmendoza.pythonanywhere.com/api'
    // baseURL: 'http://18.190.98.95:80/api'
    // baseURL: 'http://ec2-3-137-174-96.us-east-2.compute.amazonaws.com/api'
})

foodplaceApi.interceptors.request.use((config) => {
    config.headers = {
        'x-access-tokens': localStorage.getItem('token')
    }
    return config
})

export const cloudinaryApi = axios.create({
    baseURL: 'https://api.cloudinary.com/v1_1/do7bkfjje'
})

export const facturacionApi = axios.create({
    baseURL: 'https://facturacion.apisperu.com/api/v1'
})

facturacionApi.interceptors.request.use((config) => {
    config.headers = {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2ODY3MTY2OTksImV4cCI6NDg0MDMxNjY5OSwidXNlcm5hbWUiOiJjYXJsb3NybWVuZG96YSIsImNvbXBhbnkiOiIyMzEyMzQ1Njc4OSJ9.S3hx0GdKTWJNmT7ehi9ZbyQ16zeZkVh-wfIP6RL01V9a9fCCse0wHx9wTdkCvbwaaYzZ5bNsPHZM3EaJ3K7bsCTlPsGkLUD8u8aOZAVnvW0Ey-AKCqEacJjITF5fzzROJlZcTzFZUeCJxM5kcWvJSZBLyXMyFTu4SQg5aVI_6xr6BO05serC9yhU7-fcbDlqhmKDsFhb3MIir1BG3dma6tWD8MQ6BP1lGTy4a6O5Qpeuv_vKXVVvJixGGbKZgsGsfdtW0eEk_D1mvLKQ4LPelJUswUVCqHShLx9ipf6azAQ3DyUtFO7kUO344sqUtSqpkq9z6yASXIt3Chl9vJA9Wd79_kB_t9gYkuy0H5NqNoAWA-sRRBDQzRQIz6CVVfrSi8yLXSF9H05AwkQcFxxc347STpNrE0GaAgCX02Zm07C3eR7qFvGJ_RmyTUOLr9uVl7rApFJyCfZjB2xkDMD5kAQeJh59XF69XhmLjNQRypikRflJjcZBVybI37plVoIAfgFfjCPfx0alplEvtjwMpZ0gGWwROpTFSHnDLm5ltERzQhZavrXHdqSOt9M4s8x1itPU8s_XBRgnBSwOL62UgT51gpG6I5xTPDctGIgTN1T9N8P8uyeTF5-OUyZckMZpyr1UEGQsu2Gu1gc56Gc7N1l66s4tl1fA_xkBUyUS8t0'
    }
    return config
})