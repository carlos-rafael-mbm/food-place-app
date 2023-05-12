import {foodplaceApi} from "@/api/foodplaceApi"

export const loadSuppliesControl = async({commit}, id) => {
    let supplies_control = []
    try {
        const { data } = await foodplaceApi.get(`/supplies_control/search-item/${id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            supplies_control.push({...entry[1], orden: entry[0] + 1})
        }        
    } catch (error) {
        supplies_control = []
    } finally {
        commit('setSuppliesControl', supplies_control)
    }
}

export const createSupplyControl = async ({commit}, control) => {
    try {
        const {data} = await foodplaceApi.post('/supplies_control', control)
        const { id, amount, branch_warehouse_detail, item_menu } = data['control-de-insumo-creado']
        const control_nuevo = { id, amount, branch_warehouse_detail, item_menu }
        commit('addSupplyControl', control_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateSupplyControl = async({commit}, form) => {
    try {
        const idControl = form[0]
        const control = form[1]
        const {data} = await foodplaceApi.put(`/supplies_control/${idControl}`, control)
        const { id, amount, branch_warehouse_detail, item_menu } = data['control-de-insumo-actualizado']
        const control_modificado = { id, amount, branch_warehouse_detail, item_menu }
        commit('updateSupplyControl', control_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

// export const updateSupplyControlOutput = async(_, form) => {
//     try {
//         const idItemMenu = form[0]
//         const dataControl = form[1]
//         const {data} = await foodplaceApi.put(`/supplies_control/order/${idItemMenu}`, dataControl)
//         console.log(data.message)
//         return [1, data.message]
//     } catch (err) {
//         if (err.response) {
//             console.log(err.response.data.message)
//             return [0, err.response.data.message]
//         }
//     }
// }

export const deleteSupplyControl = async ({commit}, id) => {
    await foodplaceApi.delete(`/supplies_control/${id}`)
    commit('deleteSupplyControl', id)
}
