export const setVouchers = (state, vouchers) => {
    state.vouchers = [...vouchers]
}

export const setAllVouchers = (state, vouchers) => {
    state.vouchers_all = [...vouchers]
}

export const setAllCreditNotes = (state, creditNotes) => {
    state.credit_notes_all = [...creditNotes]
}

export const setVoucherDetails = (state, voucher_details) => {
    state.voucher_details = [...voucher_details]
}

export const addVoucher = (state, voucher) => {
    state.vouchers = [...state.vouchers, voucher]
}

export const addCreditNote = (state, creditNote) => {
    state.credit_notes = [...state.vouchers, creditNote]
}

export const addVoucherDetail = (state, item) => {
    state.voucher_details = [...state.voucher_details, item]
}

export const updateVoucher = (state, voucher) => {
    const idx = state.vouchers.map(e => e.id).indexOf(voucher.id)
    state.vouchers[idx] = voucher
}

export const clearVoucherComplete = (state) => {
    state.voucher_details = []
    state.vouchers = []
}

export const clearVoucherDetails = (state) => {
    state.voucher_details = []
}