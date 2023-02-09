import {foodplaceApi} from "@/api/foodplaceApi"

export const loadCategoriesSupply = async({commit}) => {
    commit('setLoading')
    const categories_supply = []
    try {
        const { data } = await foodplaceApi.get('/categories_supply')
        for (const entry of Array.prototype.entries.call(data)) {
            categories_supply.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setCategoriesSupply', categories_supply)
    } catch (error) {
        commit('setCategoriesSupply', categories_supply)
    } finally {
        commit('setLoading')
    }
}

export const createCategorySupply = async ({commit}, categoria) => {
    try {
        const {data} = await foodplaceApi.post('/categories_supply', categoria)
        const { id, name, state } = data['categoria-insumo-creada']
        const categoria_nueva = { id, name, state }
        commit('addCategorySupply', categoria_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateCategorySupply = async({commit}, form) => {
    try {
        const idCategoria = form[0]
        const categoria = form[1]
        const {data} = await foodplaceApi.put(`/categories_supply/${idCategoria}`, categoria)
        const { id, name, state } = data['categoria-insumo-actualizada']
        const categoria_modificada = { id, name, state }
        commit('updateCategorySupply', categoria_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteCategorySupply = async ({commit}, id) => {
    await foodplaceApi.delete(`/categories_supply/${id}`)
    commit('deleteCategorySupply', id)
}