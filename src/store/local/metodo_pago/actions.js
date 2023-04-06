import {foodplaceApi} from "@/api/foodplaceApi"

export const loadPaymentMethods = async({commit}) => {
    commit('setLoading')
    const paymentMethods = []
    try {
        const { data } = await foodplaceApi.get('/payment_methods')
        for (const entry of Array.prototype.entries.call(data)) {
            paymentMethods.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setPaymentMethods', paymentMethods)
    } catch (error) {
        commit('setPaymentMethods', paymentMethods)
    } finally {
        commit('setLoading')
    }
}

export const updatePaymentMethod = async({commit}, form) => {
    try {
        const idPaymentMethod = form[0]
        const paymentMethod = form[1]
        const {data} = await foodplaceApi.put(`/payment_methods/${idPaymentMethod}`, paymentMethod)
        const { id, method, image, state } = data['metodo-de-pago-actualizado']
        const metodoPagoActualizado = { id, method, image, state }
        commit('updatePaymentMethod', metodoPagoActualizado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}