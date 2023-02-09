export const getCategorySupplyById = (state) => (id = '') => {
    const category_supply = state.categories_supply.find(category_supply => category_supply.id === id)
    if (!category_supply) return
    return {...category_supply}
}