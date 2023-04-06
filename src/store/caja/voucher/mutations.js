export const setVouchers = (state, vouchers) => {
    state.vouchers = [...vouchers]
}

export const setVoucherDetails = (state, voucher_details) => {
    state.voucher_details = [...voucher_details]
}

export const addVoucher = (state, voucher) => {
    state.vouchers = [...state.vouchers, voucher]
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