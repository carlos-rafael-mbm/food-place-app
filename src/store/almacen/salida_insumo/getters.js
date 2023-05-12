export const getSupplyOutputById = (state) => (id = '') => {
    const salida = state.supplies_output.find(salida => salida.id === id)
    if (!salida) return
    return {...salida}
}

export const getSupplyOutputByIdToSelect = (state) => (id = '') => {
    console.log(state.supplies_output)
    const salida = state.supplies_output.find(salida => salida.id === id)
    console.log(salida)
    if (!salida) return
    return {
        'id': salida.id,
        'amount': salida.amount,
        'type_output': salida.type_output,
        'branch_warehouse_detail': {
            'id': salida.branch_warehouse_detail.id,
            'name': `${salida.branch_warehouse_detail.supply.name} (${salida.branch_warehouse_detail.stock.toFixed(2)} ${salida.branch_warehouse_detail.supply.measurement_unit.abbreviation})`
        }
    }
}

export const getSupplyOutputByType = (state) => (typeOutput = 2) => {
    const outputs = state.supplies_output.filter(salida => salida.type_output === typeOutput)
    if (!outputs) return
    return [...outputs]
}