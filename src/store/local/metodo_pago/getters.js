export const getActivePaymentMethods = (state) => () => {
    const payment_methods = state.payment_methods.filter(p => p.state == 1)
    if (!payment_methods) return
    payment_methods.sort((a, b) => a.id - b.id)
    return [...payment_methods]
}