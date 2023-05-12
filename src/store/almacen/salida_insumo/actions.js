import {foodplaceApi} from "@/api/foodplaceApi"

export const loadSuppliesOutput = async({commit}) => {
    let supplies_output = []
    try {
        const { data } = await foodplaceApi.get('/supplies_output')
        for (const entry of Array.prototype.entries.call(data)) {
            supplies_output.push({...entry[1], orden: entry[0] + 1})
        }        
    } catch (error) {
        supplies_output = []
    } finally {
        commit('setSuppliesOutput', supplies_output)
    }
}

export const createSupplyOutput = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/supplies_output', form)
        const { id, amount, type_output, branch_warehouse_detail } = data['salida-de-insumo-creada']
        const salida_nueva = { id, amount, type_output, branch_warehouse_detail }
        commit('addSupplyOutput', salida_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateSupplyOutput = async({commit}, form) => {
    try {
        const idOutput = form[0]
        const formOutput = form[1]
        const {data} = await foodplaceApi.put(`/supplies_output/${idOutput}`, formOutput)
        const { id, amount, type_output, branch_warehouse_detail } = data['salida-de-insumo-actualizada']
        const salida_modificada = { id, amount, type_output, branch_warehouse_detail }
        commit('updateSupplyOutput', salida_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createSupplyOutputByItemMenu = async(_, form) => {
    try {
        const idItemMenu = form[0]
        const dataSalida = form[1]
        const {data} = await foodplaceApi.post(`/supplies_output/item_menu/${idItemMenu}`, dataSalida)
        console.log(data.message)
        return [1, data.message]
    } catch (err) {
        if (err.response) {
            console.log(err.response.data.message)
            return [0, err.response.data.message]
        }
    }
}

export const deleteSupplyOutput = async ({commit}, id) => {
    await foodplaceApi.delete(`/supplies_output/${id}`)
    commit('deleteSupplyOutput', id)
}

export const deleteAllSuppliesOutput = async() => {
    try {
        const {data} = await foodplaceApi.delete('/supplies_output')
        console.log(data.message)
        return [1, data.message]
    } catch (err) {
        if (err.response) {
            console.log(err.response.data.message)
            return [0, err.response.data.message]
        }
    }
}