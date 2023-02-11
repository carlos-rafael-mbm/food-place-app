import state from "./state"
import * as actions from "./actions"
import * as mutations from "./mutations"
import * as getters from "./getters"

const asignacionCajaModule = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}

export default asignacionCajaModule