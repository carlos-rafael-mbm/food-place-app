export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setBranches = (state, branches) => {
    state.branches = [...branches]
}

export const setBranchWarehousesDetail = (state, branch_warehouses_detail) => {
    state.branch_warehouses_detail = [...branch_warehouses_detail]
}

export const addBranch = (state, branch) => {
    state.branches = [...state.branches, branch]
}

export const addBranchWarehouseDetail = (state, branch_warehouse_detail) => {
    state.branch_warehouses_detail = [...state.branch_warehouses_detail, branch_warehouse_detail]
}

export const updateBranch = (state, branch) => {
    const idx = state.branches.map(e => e.id).indexOf(branch.id)
    state.branches[idx] = branch
}

export const updateBranchWarehouseDetail = (state, branch_warehouse_detail) => {
    const idx = state.branch_warehouses_detail.map(e => e.id).indexOf(branch_warehouse_detail.id)
    state.branch_warehouses_detail[idx] = branch_warehouse_detail
}

export const deleteBranch = (state, id) => {
    state.branches = state.branches.filter(e => e.id !== id)
}

export const deleteBranchWarehouseDetail = (state, id) => {
    state.branch_warehouses_detail = state.branch_warehouses_detail.filter(e => e.id !== id)
}