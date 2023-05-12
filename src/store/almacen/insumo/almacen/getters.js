export const getBranchById = (state) => (id = '') => {
    const branch = state.branches.find(branch => branch.id === id)
    if (!branch) return
    return {...branch}
}

export const getActiveBranches = (state) => () => {
    const branches = [...state.branches.filter(p => p.state == 1)]
    if (!branches) return
    return [...branches]
}

export const getSuppliesToEntry = (state) => {
    const branch_warehouse_detail = [...state.branch_warehouses_detail]
    const supplies_entry = []
    for (let detail of branch_warehouse_detail) {
        detail.supply.stock = detail.stock
        detail.supply.stock_in = 0
        detail.supply.price_in = 0
        supplies_entry.push(detail.supply)
    }
    return supplies_entry
}

export const getSuppliesToStockCount = (state) => {
    const branch_warehouse_detail = [...state.branch_warehouses_detail]
    const supplies_count = []
    for (let detail of branch_warehouse_detail) {
        detail.supply.stock = detail.stock
        detail.supply.stock_count = detail.stock
        supplies_count.push(detail.supply)
    }
    return supplies_count
}

export const getSuppliesFromDetail = (state) => {
    let supplies = []
    state.branch_warehouses_detail.map(m => supplies.push({...m.supply}))
    if (!supplies) return
    supplies.sort((a, b) => a.category_supply.id - b.category_supply.id)
    return [...supplies]
}

export const getDetailByBranch = (state) => (idBranch = '', idItem = '') => {
    const branch_warehouse_detail = state.branch_warehouses_detail.find(m => m.branch.id == idBranch && m.supply.id == idItem)
    if (!branch_warehouse_detail) return
    return {...branch_warehouse_detail}
}

export const getSuppliesToSelect = (state) => {
    let supplies = []
    state.branch_warehouses_detail.map(m => supplies.push({id: m.id, name: `${m.supply.name} (${m.stock.toFixed(2)} ${m.supply.measurement_unit.abbreviation})`}))
    if (!supplies) return
    return [...supplies]
}