export const setLoadingCategories = (state) => {
    state.isLoadingCategory = !state.isLoadingCategory
}

export const setLoadingItemsMenu = (state) => {
    state.isLoadingItemMenu = !state.isLoadingItemMenu
}

export const setCategories = (state, categories) => {
    state.categories = [...categories]
}

export const updateCategory = (state, categoria) => {
    const idx = state.categories.map(e => e.id).indexOf(categoria.id)
    state.categories[idx] = categoria
}

export const addCategory = (state, categoria) => {
    state.categories = [...state.categories, categoria]
}

export const deleteCategory = (state, id) => {
    state.categories = state.categories.filter(e => e.id !== id)
}

export const setItemsMenu = (state, items_menu) => {
    state.items_menu = [...items_menu]
}

export const addItemMenu = (state, item_menu) => {
    state.items_menu = [...state.items_menu, item_menu]
}

export const updateItemMenu = (state, item_menu) => {
    const idx = state.items_menu.map(e => e.id).indexOf(item_menu.id)
    state.items_menu[idx] = item_menu
}

export const deleteItemMenu = (state, id) => {
    state.items_menu = state.items_menu.filter(e => e.id !== id)
}