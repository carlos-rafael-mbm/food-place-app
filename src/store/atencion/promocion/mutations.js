export const setPromotions = (state, items) => {
    state.promotions = [...items]
}

export const addPromotion = (state, promotion) => {
    state.promotions = [...state.promotions, promotion]
}

export const updatePromotion = (state, promotion) => {
    const idx = state.promotions.map(e => e.id).indexOf(promotion.id)
    state.promotions[idx] = promotion
}

export const deletePromotion = (state, id) => {
    state.promotions = state.promotions.filter(e => e.id !== id)
}