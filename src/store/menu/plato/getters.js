// export const getEntriesByTerm = (state) => (term = '') => {
//     if (!term) return state.entries
//     return state.entries.filter(entry => entry.text.toLowerCase().includes(term.toLowerCase()))
// }

export const getCategoryById = (state) => (id = '') => {
    const category = state.categories.find(category => category.id === id)
    if (!category) return
    return {...category}
}

export const getItemMenuById = (state) => (id = '') => {
    const item_menu = state.items_menu.find(item => item.id === id)
    if (!item_menu) return
    return {...item_menu}
}

export const getActiveItemMenu = (state) => () => {
    const item_menu = state.items_menu.filter(item => item.state == 1)
    if (!item_menu) return
    item_menu.sort((a, b) => a.category.id - b.category.id)
    return [...item_menu]
}