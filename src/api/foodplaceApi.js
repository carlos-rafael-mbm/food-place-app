import axios from "axios";

export const foodplaceApi = axios.create({
    baseURL: 'http://127.0.0.1:5000/api'
    // baseURL: 'https://carlosrmendoza.pythonanywhere.com/api'
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
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzQyNTUyNDgsImV4cCI6NDgyNzg1NTI0OCwidXNlcm5hbWUiOiJjYXJsb3NybWVuZG96YSIsImNvbXBhbnkiOiIyMjEyMzQ1Njc4OSJ9.NAsEKslkhTnYRme6x2gSsMqLqlEMFudjxcxpT3SeLSGod6HidvpItY5TCXHWHwlmb-1mMS-AjrJ42ZUyJQqeBPvi1k6gawd3xH16oqE_G2glq2n2hhNJ9--KzVsg2QawQ331MQ9H8-99_P0fwQF0ILoivH1m9oi4-9MM_sw7LXprLjPghxH3DfcAPdg87nWt5wZE5X3LtUopjEaqOCep27VUAw7FhfwxGilwJo_OYJTL2pTK6PQ0gc1Zz1IS52Dr4kxKSLkRA54ro0y4BYdwcqzbS_r6o-vq7B0FpHdKMXASd0lQ416V-K-LSg8E3Ga7U89Xf_njBGwdHE0HQhfUy-mrvoi6lBX7dou88_DveWojmPWdqpkBA3BwmULWZLlwL3qXwnuuJKn7QWbeX1iVJ42tZ_3Ro1_ZmrfHd_AQeVqVvx5WhIA-5GJJrH-FRwRzOpQeSyW1d7ZtVBkiGTQfc77Km-BWo2d-NZlQWs_LfFdE2u9Fh4WLIeRtSV_4_C6QB6zWTVTKNZZX49ilplXLzD8VHV9A6wv06NtYQEg3BE_7waMi7474jPI6v3kdWINjVHylUnslSA-A1pj26iNTsKCqFv7Fp614jpzGCARTsZFucXZON3ZYY1o6Vt1sCYh7ngBLaZfYmOCVMYQpKJV87WCYHn0_LUoFlQWDABl9Wdw'
    }
    return config
})