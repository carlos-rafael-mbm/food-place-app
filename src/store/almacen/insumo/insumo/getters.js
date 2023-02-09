export const getSupplyById = (state) => (id = '') => {
    const supply = state.supplies.find(supply => supply.id === id)
    if (!supply) return
    return {...supply}
}