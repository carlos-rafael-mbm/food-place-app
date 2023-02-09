export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setCategoriesSupply = (state, categories_supply) => {
    state.categories_supply = [...categories_supply]
}

export const addCategorySupply = (state, categoria) => {
    state.categories_supply = [...state.categories_supply, categoria]
}

export const updateCategorySupply = (state, categoria) => {
    const idx = state.categories_supply.map(e => e.id).indexOf(categoria.id)
    state.categories_supply[idx] = categoria
}

export const deleteCategorySupply = (state, id) => {
    state.categories_supply = state.categories_supply.filter(e => e.id !== id)
}