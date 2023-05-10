export const setSuppliesControl = (state, supplies_control) => {
    state.supplies_control = [...supplies_control]
}

export const addSupplyControl = (state, supply_control) => {
    state.supplies_control = [...state.supplies_control, supply_control]
}

export const updateSupplyControl = (state, supply_control) => {
    const idx = state.supplies_control.map(e => e.id).indexOf(supply_control.id)
    state.supplies_control[idx] = supply_control
}

export const deleteSupplyControl = (state, id) => {
    state.supplies_control = state.supplies_control.filter(e => e.id !== id)
}