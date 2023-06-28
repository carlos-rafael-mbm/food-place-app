import { foodplaceApi } from "@/api/foodplaceApi"

export const loadVouchersReport = async({commit}, year) => {
    const vouchers = []
    try {
        const { data } = await foodplaceApi.get(`/vouchers/report/${year}`)
        for (const entry of Array.prototype.entries.call(data)) {
            vouchers.push({...entry[1], orden: entry[0] + 1})
        }
        if (vouchers) {
            vouchers.sort((a, b) => b.id - a.id)
        }
        commit('setVouchers', vouchers)
    } catch (error) {
        commit('setVouchers', vouchers)
    }
}

export const loadVouchersById = async(_, id) => {
    try {
        const { data } = await foodplaceApi.get(`/vouchers/${id}`)
        return data['comprobante-consultado']
    } catch (error) {
        return {}
    }
}

export const loadVouchersByAssigment = async(_, assignment_id) => {
    const vouchers = []
    try {
        const { data } = await foodplaceApi.get(`/vouchers/search-assignment/${assignment_id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            vouchers.push({...entry[1], orden: entry[0] + 1})
        }
        if (vouchers) {
            vouchers.sort((a, b) => b.id - a.id)
        }
        return vouchers
    } catch (error) {
        return vouchers
    }
}

export const loadAllVouchers = async({commit}) => {
    const vouchers = []
    try {
        const { data } = await foodplaceApi.get('/vouchers')
        for (const entry of Array.prototype.entries.call(data)) {
            vouchers.push({...entry[1], orden: entry[0] + 1})
        }
        if (vouchers) {
            vouchers.sort((a, b) => b.id - a.id)
        }
        commit('setAllVouchers', vouchers)
    } catch (error) {
        commit('setAllVouchers', vouchers)
    }
}

export const loadAllCreditNotes = async({commit}) => {
    const creditNotes = []
    try {
        const { data } = await foodplaceApi.get('/credit_notes')
        for (const entry of Array.prototype.entries.call(data)) {
            creditNotes.push({...entry[1], orden: entry[0] + 1})
        }
        if (creditNotes) {
            creditNotes.sort((a, b) => b.id - a.id)
        }
        commit('setAllCreditNotes', creditNotes)
    } catch (error) {
        commit('setAllCreditNotes', creditNotes)
    }
}

export const loadCdrById = async(_, id) => {
    try {
        const { data } = await foodplaceApi.get(`/vouchers/search-cdr/${id}`)
        return data
    } catch (error) {
        return null
    }
}

export const loadVoucherDetailsByVoucher = async({commit}, id) => {
    let voucher_details = []
    try {
        const { data } = await foodplaceApi.get(`/voucher_details/search-voucher/${id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            voucher_details.push({...entry[1], orden: entry[0] + 1})
        }
        if (voucher_details)
            voucher_details.sort((a, b) => a.category - b.category)
    } catch (error) {
        voucher_details = []
    } finally {
        commit('setVoucherDetails', voucher_details)
    }
}

export const createVoucher = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/vouchers', form)
        const { id, issuance_time, doc_type, serie, correlative, tax_value, total_no_tax, tax_amount, total_tax, total_tax_text, reference, state, table_id, client, payment_method, cash_register_assignment } = data['comprobante-creado']
        const comprobante_nuevo = { id, issuance_time, doc_type, serie, correlative, tax_value, total_no_tax, tax_amount, total_tax, total_tax_text, reference, state, table_id, client, payment_method, cash_register_assignment }
        commit('addVoucher', comprobante_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createCreditNote = async ({commit}, form) => {
    try {
        console.log(form)
        const {data} = await foodplaceApi.post('/credit_notes', form)
        console.log(data)
        const { id, doc_type, serie, correlative, issuance_time, affected_doc_type, affected_doc_number, reason_code, reason_desc, voucher } = data['nota-de-credito-creada']
        const comprobante_nuevo = { id, doc_type, serie, correlative, issuance_time, affected_doc_type, affected_doc_number, reason_code, reason_desc, voucher }
        commit('addCreditNote', comprobante_nuevo)
        return [id, 'Ok']
    } catch (err) {
        console.log(err)
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createVoucherDetail = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/voucher_details', form)
        const { id, unit, amount, sku, category, item_menu, price_no_tax, price_tax, subtotal, total, voucher } = data['detalle-creado']
        const item_nuevo = { id, unit, amount, sku, category, item_menu, price_no_tax, price_tax, subtotal, total, voucher }
        commit('addVoucherDetail', item_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateVoucher = async({commit}, form) => {
    try {
        const idVoucher = form[0]
        const voucher = form[1]
        const {data} = await foodplaceApi.put(`/vouchers/${idVoucher}`, voucher)
        const { id, issuance_time, doc_type, serie, correlative, tax_value, total_no_tax, tax_amount, total_tax, total_tax_text, reference, state, table_id, client, payment_method, cash_register_assignment } = data['comprobante-actualizado']
        const comprobante_modificado = { id, issuance_time, doc_type, serie, correlative, tax_value, total_no_tax, tax_amount, total_tax, total_tax_text, reference, state, table_id, client, payment_method, cash_register_assignment }
        commit('updateVoucher', comprobante_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const clearVoucherComplete = async ({commit}) => {
    commit('clearVoucherComplete')
}

export const clearVoucherDetails = async ({commit}) => {
    commit('clearVoucherDetails')
}