import {foodplaceApi} from "@/api/foodplaceApi"

export const loadBranches = async({commit}) => {
    commit('setLoading')
    const branches = []
    try {
        const { data } = await foodplaceApi.get('/branches')
        for (const entry of Array.prototype.entries.call(data)) {
            branches.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setBranches', branches)
    } catch (error) {
        commit('setBranches', branches)
    } finally {
        commit('setLoading')
    }
}

export const loadBranchWarehousesDetailByMain = async({commit}) => {
    let branch_warehouses_detail = []
    try {
        const { data } = await foodplaceApi.get(`/branch_warehouses_detail/search-main-branch`)
        for (const entry of Array.prototype.entries.call(data)) {
            branch_warehouses_detail.push({...entry[1], orden: entry[0] + 1})
        }
    } catch (error) {
        branch_warehouses_detail = []
    } finally {
        commit('setBranchWarehousesDetail', branch_warehouses_detail)
    }
}

export const loadBranchWarehousesDetail = async({commit}, id) => {
    let branch_warehouses_detail = []
    try {
        const { data } = await foodplaceApi.get(`/branch_warehouses_detail/search-branch-warehouse/${id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            branch_warehouses_detail.push({...entry[1], orden: entry[0] + 1})
        }
    } catch (error) {
        branch_warehouses_detail = []
    } finally {
        commit('setBranchWarehousesDetail', branch_warehouses_detail)
    }
}

export const createBranch = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/branches', form)
        const { id, name, address, state } = data['sucursal-creada']
        const sucursal_nueva = { id, name, address, state }
        commit('addBranch', sucursal_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createBranchWarehouseDetail = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/branch_warehouses_detail', form)
        const { id, stock, branch, supply } = data['detalle-creado']
        const item_nuevo = { id, stock, branch, supply }
        commit('addBranchWarehouseDetail', item_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateBranch = async({commit}, form) => {
    try {
        const idSucursal = form[0]
        const sucursal = form[1]
        const {data} = await foodplaceApi.put(`/branches/${idSucursal}`, sucursal)
        const { id, name, address, state } = data['sucursal-actualizada']
        const sucursal_modificada = { id, name, address, state }
        commit('updateBranch', sucursal_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateBranchWarehouseDetail = async ({commit}, form) => {
    try {
        const idWarehouseDetail = form[0]
        const branch_warehouse_detail = form[1]
        const {data} = await foodplaceApi.put(`/branch_warehouses_detail/${idWarehouseDetail}`, branch_warehouse_detail)
        const { id, stock, branch, supply } = data['detalle-actualizado']
        const item_modificado = { id, stock, branch, supply }
        commit('updateBranchWarehouseDetail', item_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteBranch = async ({commit}, id) => {
    await foodplaceApi.delete(`/branches/${id}`)
    commit('deleteBranch', id)
}

export const deleteBranchWarehouseDetail = async ({commit}, id) => {
    await foodplaceApi.delete(`/branch_warehouses_detail/${id}`)
    commit('deleteBranchWarehouseDetail', id)
}