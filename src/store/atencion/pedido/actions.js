import { foodplaceApi } from "@/api/foodplaceApi"

export const loadActiveMenu = async({commit}) => {
    const active_items = []
    try {
        const { data } = await foodplaceApi.get('/menu_detail/active')
        for (const entry of Array.prototype.entries.call(data)) {
            active_items.push({...entry[1], orden: entry[0] + 1})
        }
        if (active_items)
            active_items.sort((a, b) => a.item_menu.category.id - b.item_menu.category.id)
        commit('setActiveMenu', active_items)
    } catch (error) {
        commit('setActiveMenu', active_items)
    }
}

export const loadOrders = async({commit}) => {
    const orders = []
    try {
        const { data } = await foodplaceApi.get('/orders/today')
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        if (orders) {
            orders.sort((a, b) => b.id - a.id)
        }
        commit('setOrders', orders)
    } catch (error) {
        commit('setOrders', orders)
    }
}

export const loadAllOrders = async({commit}) => {
    const orders = []
    try {
        const { data } = await foodplaceApi.get('/orders')
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        if (orders) {
            orders.sort((a, b) => b.id - a.id)
        }
        commit('setAllOrders', orders)
    } catch (error) {
        commit('setAllOrders', orders)
    }
}

export const loadOrdersReport = async(_, year) => {
    const orders = []
    try {
        const { data } = await foodplaceApi.get(`/orders/report/${year}`)
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        return orders
    } catch (error) {
        return orders
    }
}

export const loadOrdersByPreparationArea = async({commit}, preparation_area_id) => {
    const orders = []
    try {
        const { data } = await foodplaceApi.get(`/orders/search-preparation-area-today/${preparation_area_id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        if (orders) {
            orders.sort((a, b) => b.id - a.id)
        }
        commit('setOrders', orders)
    } catch (error) {
        console.log(error)
        commit('setOrders', orders)
    }
}

export const loadOrdersToServe = async({commit}, employee_id) => {
    const orders = []
    try {
        const { data } = await foodplaceApi.get(`/orders/to-serve/${employee_id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        if (orders) {
            orders.sort((a, b) => b.id - a.id)
        }
        commit('setOrders', orders)
    } catch (error) {
        commit('setOrders', orders)
    }
}

export const loadOrdersByAssigment = async(_, assignment_id) => {
    const orders = []
    try {
        const { data } = await foodplaceApi.get(`/orders/search-assignment/${assignment_id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        if (orders) {
            orders.sort((a, b) => b.id - a.id)
        }
        return orders
    } catch (error) {
        return orders
    }
}

export const loadOrdersToPrint = async({commit}) => {
    const orders = []
    try {
        const { data } = await foodplaceApi.get('/orders/print')
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        if (orders) {
            orders.sort((a, b) => b.id - a.id)
        }
        commit('setOrders', orders)
    } catch (error) {
        commit('setOrders', orders)
    }
}

export const loadMostRequestedItemsByMonth = async(_, filter) => {
    const orders = []
    const year = filter[0]
    const month = filter[1]
    try {
        const { data } = await foodplaceApi.get(`/orders/report/${year}/${month}`)
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        return orders
    } catch (error) {
        return orders
    }
}

export const loadEmployeeProductivity = async(_, filter) => {
    const orders = []
    const year = filter[0]
    const month = filter[1]
    try {
        const { data } = await foodplaceApi.get(`/orders/report-productivity/${year}/${month}`)
        for (const entry of Array.prototype.entries.call(data)) {
            orders.push({...entry[1], orden: entry[0] + 1})
        }
        return orders
    } catch (error) {
        return orders
    }
}

export const loadOrderDetails = async({commit}, id) => {
    let order_details = []
    try {
        const { data } = await foodplaceApi.get(`/order_detail/search-order/${id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            order_details.push({...entry[1], orden: entry[0] + 1})
        }
        if (order_details)
            order_details.sort((a, b) => a.menu_detail.item_menu.category.id - b.menu_detail.item_menu.category.id)
    } catch (error) {
        order_details = []
    } finally {
        commit('setOrderDetails', order_details)
    }
}

export const loadOrderDetailsByVoucher = async({commit}, comprobante) => {
    let order_details = []
    const serie = comprobante[0]
    const correlative = comprobante[1]
    try {
        const { data } = await foodplaceApi.get(`/order_detail/search-order/${serie}/${correlative}`)
        for (const entry of Array.prototype.entries.call(data)) {
            order_details.push({...entry[1], orden: entry[0] + 1})
        }
        if (order_details)
            order_details.sort((a, b) => a.menu_detail.item_menu.category.id - b.menu_detail.item_menu.category.id)
    } catch (error) {
        order_details = []
    } finally {
        commit('setOrderDetails', order_details)
    }
}

export const revertOrder = async(_, voucher_id) => {
    let response = {}
    try {
        const { data } = await foodplaceApi.get(`/orders/revert/${voucher_id}`)
        response = data
    } catch (error) {
        response.rpta = 0
        response.message = 'Error'
    }
    return response
}

export const createOrder = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/orders', form)
        const { id, order_time, state, client, table } = data['pedido-creado']
        const pedido_nuevo = { id, order_time, state, client, table }
        commit('addOrder', pedido_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createOrderDetail = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/order_detail', form)
        const { id, price, amount, state, order, menu_detail } = data['detalle-creado']
        const item_nuevo = { id, price, amount, state, order, menu_detail }
        commit('addOrderDetail', item_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createAssignmentOrder = async (_, form) => {
    try {
        const {data} = await foodplaceApi.post('/assignment_order', form)
        const { id } = data['asignacion-creada']
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateOrder = async({commit}, form) => {
    try {
        const idOrder = form[0]
        const order = form[1]
        const {data} = await foodplaceApi.put(`/orders/${idOrder}`, order)
        const { id, order_time, state, client, table } = data['pedido-actualizado']
        const pedido_modificado = { id, order_time, state, client, table }
        commit('updateOrder', pedido_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateOrderDetail = async ({commit}, form) => {
    try {
        const idOrderDetail = form[0]
        const order_detail = form[1]
        const {data} = await foodplaceApi.put(`/order_detail/${idOrderDetail}`, order_detail)
        const { id, price, amount, state, order, menu_detail } = data['detalle-actualizado']
        const item_modificado = { id, price, amount, state, order, menu_detail }
        commit('updateOrderDetail', item_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteOrderDetail = async ({commit}, id) => {
    await foodplaceApi.delete(`/order_detail/${id}`)
    commit('deleteOrderDetail', id)
}

export const clearOrderComplete = async ({commit}) => {
    commit('clearOrderComplete')
}

export const clearOrderDetails = async ({commit}) => {
    commit('clearOrderDetails')
}