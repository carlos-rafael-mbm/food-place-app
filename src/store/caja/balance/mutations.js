export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setCashierBalancings = (state, cashier_balancings) => {
    state.cashier_balancings = [...cashier_balancings]
}

export const addCashierBalancing = (state, cashier_balancing) => {
    state.cashier_balancings = [...state.cashier_balancings, cashier_balancing]
}

export const updateCashierBalancing = (state, cashier_balancing) => {
    const idx = state.cashier_balancings.map(e => e.id).indexOf(cashier_balancing.id)
    state.cashier_balancings[idx] = cashier_balancing
}