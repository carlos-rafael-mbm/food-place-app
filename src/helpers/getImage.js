import foodplaceApi from "@/api/foodplaceApi"

const getImageObject = async (name_file) => {
    try {
        const {data} = await foodplaceApi.get(`/uploads/${name_file}`)
        return data.encodedImage
    } catch (err) {
        return null
    }
}

export default getImageObject