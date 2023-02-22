export const getCashierBalancingById = (state) => (id = '') => {
    const cashier_balancing = state.cashier_balancings.find(m => m.id === id)
    if (!cashier_balancing) return
    return {...cashier_balancing}
}

export const getCashierBalancingsInOrder = (state) => () => {
    const cashier_balancings = [...state.cashier_balancings]
    if (!cashier_balancings) return
    cashier_balancings.sort((a, b) => b.id - a.id)
    return [...cashier_balancings]
}

export const getCashierBalancingsClosedInOrder = (state) => () => {
    const cashier_balancings = [...state.cashier_balancings.filter(a => a.state == 1 || a.state == 2)]
    if (!cashier_balancings) return
    cashier_balancings.sort((a, b) => b.id - a.id)
    return [...cashier_balancings]
}

export const getCashierBalancingsConsultedInOrder = (state) => () => {
    const cashier_balancings = [...state.cashier_balancings.filter(a => a.state == 0)]
    if (!cashier_balancings) return
    cashier_balancings.sort((a, b) => b.id - a.id)
    return [...cashier_balancings]
}