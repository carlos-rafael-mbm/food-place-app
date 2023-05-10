export const getSupplyControlById = (state) => (id = '') => {
    const control = state.supplies_control.find(control => control.id === id)
    if (!control) return
    return {...control}
}