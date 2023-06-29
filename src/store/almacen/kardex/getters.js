export const getSupplyById = (state) => (id = '') => {
    const supply = state.supplies.find(supply => supply.id === id)
    if (!supply) return
    return {...supply}
}

export const getMovementReasonsByType = (state) => (type = '') => {
    const reasons = state.movement_reasons.filter(razon => razon.reason_type === type)
    if (!reasons) return
    return [...reasons]
}

