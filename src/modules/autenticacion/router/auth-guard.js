import store from '@/store'

export const isAuthenticatedGuard = async(to, from, next) => {
    const {ok} = await store.dispatch('login/checkAuthentication')
    if (ok) next()
    else next({name: 'login'})
}

export const isAuthenticatedAdmin = async(to, from, next) => {
    // Guard para ingreso de administradores(1), asistentes de administración(9) y jefe de comedor(6)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 9 || user.role.id == 6) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}

export const isAuthenticatedWaiter = async(to, from, next) => {
    // Guard para ingreso de administradores(1), asistentes de administración(9) y mozos(2)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 9 || user.role.id == 2) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}

export const isAuthenticatedCashier = async(to, from, next) => {
    // Guard para ingreso de administradores(1), asistentes de administración(9) y cajeros(4)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 9 || user.role.id == 4) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}

export const isAuthenticatedCook = async(to, from, next) => {
    // Guard para ingreso de administradores(1), asistentes de administración(9), chefs(3), cocineros(10), bartender(11) y asistentes de cocina(12)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 9 || user.role.id == 3 || user.role.id == 10 || user.role.id == 11 || user.role.id == 12) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}

export const isAuthenticatedStorekeeper = async(to, from, next) => {
    // Guard para ingreso de administradores(1), asistentes de administración(9), almaceneros(5) y asistentes de almacén(13)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 9 || user.role.id == 5 || user.role.id == 13) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}