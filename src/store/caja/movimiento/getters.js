export const getCashRegisterMovementById = (state) => (id = '') => {
    const cash_register_movement = state.cash_register_movements.find(m => m.id === id)
    if (!cash_register_movement) return
    return {...cash_register_movement}
}

export const getCashRegisterMovementsInOrder = (state) => () => {
    const cash_register_movements = [...state.cash_register_movements]
    if (!cash_register_movements) return
    cash_register_movements.sort((a, b) => b.id - a.id)
    return [...cash_register_movements]
}