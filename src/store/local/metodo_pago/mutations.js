export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setPaymentMethods = (state, payment_methods) => {
    state.payment_methods = [...payment_methods]
}

export const updatePaymentMethod = (state, payment_method) => {
    const idx = state.payment_methods.map(e => e.id).indexOf(payment_method.id)
    state.payment_methods[idx] = payment_method
}