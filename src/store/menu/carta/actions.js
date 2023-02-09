import {foodplaceApi} from "@/api/foodplaceApi"

export const loadMenus = async({commit}) => {
    commit('setLoading')
    const menus = []
    try {
        const { data } = await foodplaceApi.get('/menu')
        for (const entry of Array.prototype.entries.call(data)) {
            menus.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setMenus', menus)
    } catch (error) {
        commit('setMenus', menus)
    } finally {
        commit('setLoading')
    }
}

export const createMenu = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/menu', form)
        const { id, name, image, state} = data['menu-creado']
        const menu_nuevo = { id, name, image, state}
        commit('addMenu', menu_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateMenu = async({commit}, form) => {
    try {
        const idMenu = form[0]
        const menu = form[1]
        const {data} = await foodplaceApi.put(`/menu/${idMenu}`, menu)
        const { id, name, image, state} = data['menu-actualizado']
        const menu_modificado = { id, name, image, state}
        commit('updateMenu', menu_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteMenu = async ({commit}, id) => {
    await foodplaceApi.delete(`/menu/${id}`)
    commit('deleteMenu', id)
}

export const loadMenuDetails = async({commit}, id) => {
    let menu_details = []
    try {
        const { data } = await foodplaceApi.get(`/menu_detail/search-menu/${id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            menu_details.push({...entry[1], orden: entry[0] + 1})
        }
    } catch (error) {
        menu_details = []
    } finally {
        commit('setMenuDetails', menu_details)
    }
}

export const createMenuDetail = async ({commit}, form) => {
    commit('setProcessing')
    try {
        const {data} = await foodplaceApi.post('/menu_detail', form)
        const { id, selling_price, created_at, updated_at, state, menu, item_menu } = data['detalle-creado']
        const detalle_nuevo = { id, selling_price, created_at, updated_at, state, menu, item_menu }
        commit('addMenuDetail', detalle_nuevo)
        commit('setProcessing')
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            commit('setProcessing')
            return [0, err.response.data.message]
        }
    }
}

export const deleteMenuDetail = async ({commit}, id) => {
    commit('setProcessing')
    await foodplaceApi.delete(`/menu_detail/${id}`)
    commit('deleteMenuDetail', id)
    commit('setProcessing')
}