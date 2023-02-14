export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setCashRegisterMovements = (state, cash_register_movements) => {
    state.cash_register_movements = [...cash_register_movements]
}

export const addCashRegisterMovement = (state, cash_register_movement) => {
    state.cash_register_movements = [...state.cash_register_movements, cash_register_movement]
}

export const updateCashRegisterMovement = (state, cash_register_movement) => {
    const idx = state.cash_register_movements.map(e => e.id).indexOf(cash_register_movement.id)
    state.cash_register_movements[idx] = cash_register_movement
}