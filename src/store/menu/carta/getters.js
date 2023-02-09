export const getMenuById = (state) => (id = '') => {
    const menu = state.menus.find(m => m.id === id)
    if (!menu) return
    return {...menu}
}

export const getItemMenuFromDetail = (state) => () => {
    let items_menu = []
    state.menu_details.map(m => items_menu.push({...m.item_menu}))
    if (!items_menu) return
    items_menu.sort((a, b) => a.category.id - b.category.id)
    return [...items_menu]
}

export const getMenuDetailByMenu = (state) => (idMenu = '', idItem = '') => {
    let menu_detail = state.menu_details.find(m => m.menu.id == idMenu && m.item_menu.id == idItem)
    if (!menu_detail) return
    return {...menu_detail}
}