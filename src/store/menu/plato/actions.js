import {foodplaceApi} from "@/api/foodplaceApi"

export const loadCategories = async({commit}) => {
    commit('setLoadingCategories')
    const categories = []
    try {
        const { data } = await foodplaceApi.get('/categories')
        for (const entry of Array.prototype.entries.call(data)) {
            categories.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setCategories', categories)
    } catch (error) {
        commit('setCategories', categories)
    } finally {
        commit('setLoadingCategories')
    }
}

export const updateCategory = async({commit}, form) => {
    try {
        const idCategoria = form[0]
        const categoria = form[1]
        const {data} = await foodplaceApi.put(`/categories/${idCategoria}`, categoria)
        const { id, name, image, is_block, state} = data['categoria-actualizada']
        const categoria_modificada = { id, name, image, is_block, state}
        commit('updateCategory', categoria_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createCategory = async ({commit}, categoria) => {
    try {
        const {data} = await foodplaceApi.post('/categories', categoria)
        const { id, name, image, is_block, state} = data['categoria-creada']
        const categoria_nueva = { id, name, image, is_block, state}
        commit('addCategory', categoria_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteCategory = async ({commit}, id) => {
    await foodplaceApi.delete(`/categories/${id}`)
    commit('deleteCategory', id)
}

export const loadItemsMenu = async({commit}) => {
    commit('setLoadingItemsMenu')
    const items_menu = []
    try {
        const { data } = await foodplaceApi.get('/items_menu')
        for (const entry of Array.prototype.entries.call(data)) {
            items_menu.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setItemsMenu', items_menu)
    } catch (error) {
        commit('setItemsMenu', items_menu)
    } finally {
        commit('setLoadingItemsMenu')
    }
}

export const createItemMenu = async ({commit}, item_menu) => {
    try {
        const {data} = await foodplaceApi.post('/items_menu', item_menu)
        const { id, name, brief, image, created_at, updated_at, cost, state, category, preparation_area } = data['item-creado']
        const item_nuevo = { id, name, brief, image, created_at, updated_at, cost, state, category, preparation_area }
        commit('addItemMenu', item_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateItemMenu = async({commit}, form) => {
    try {
        const idItemMenu = form[0]
        const item_nuevo = form[1]
        const {data} = await foodplaceApi.put(`/items_menu/${idItemMenu}`, item_nuevo)
        const { id, name, brief, image, created_at, updated_at, cost, state, category, preparation_area } = data['item-actualizado']
        const item_modificado = { id, name, brief, image, created_at, updated_at, cost, state, category, preparation_area }
        commit('updateItemMenu', item_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteItemMenu = async ({commit}, id) => {
    await foodplaceApi.delete(`/items_menu/${id}`)
    commit('deleteItemMenu', id)
}