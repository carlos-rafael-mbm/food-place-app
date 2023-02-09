export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setProcessing = (state) => {
    state.isProcessing = !state.isProcessing
}

export const setMenus = (state, menus) => {
    state.menus = [...menus]
}

export const addMenu = (state, menu) => {
    state.menus = [...state.menus, menu]
}

export const updateMenu = (state, menu) => {
    const idx = state.menus.map(e => e.id).indexOf(menu.id)
    state.menus[idx] = menu
}

export const deleteMenu = (state, id) => {
    state.menus = state.menus.filter(e => e.id !== id)
}

export const setMenuDetails = (state, menu_details) => {
    state.menu_details = [...menu_details]
}

export const addMenuDetail = (state, menu_detail) => {
    state.menu_details = [...state.menu_details, menu_detail]
}

export const deleteMenuDetail = (state, id) => {
    state.menu_details = state.menu_details.filter(e => e.id !== id)
}