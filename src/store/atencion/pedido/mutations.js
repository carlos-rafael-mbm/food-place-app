export const setActiveMenu = (state, items) => {
    state.active_menu = [...items]
}

export const setOrders = (state, orders) => {
    state.orders = [...orders]
}

export const setAllOrders = (state, orders) => {
    state.orders_all = [...orders]
}

export const setOrderDetails = (state, order_details) => {
    state.order_details = [...order_details]
}

export const addOrder = (state, order) => {
    state.orders = [...state.orders, order]
}

export const addOrderDetail = (state, item) => {
    state.order_details = [...state.order_details, item]
}

export const updateOrder = (state, order) => {
    const idx = state.orders.map(e => e.id).indexOf(order.id)
    state.orders[idx] = order
}

export const updateOrderDetail = (state, order_detail) => {
    const idx = state.order_details.map(e => e.id).indexOf(order_detail.id)
    state.order_details[idx] = order_detail
}

export const deleteOrderDetail = (state, id) => {
    state.order_details = state.order_details.filter(e => e.id !== id)
}

export const clearOrderComplete = (state) => {
    state.order_details = []
    state.orders = []
}

export const clearOrderDetails = (state) => {
    state.order_details = []
}