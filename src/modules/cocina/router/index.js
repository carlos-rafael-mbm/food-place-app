import {isAuthenticatedCook} from '@/modules/autenticacion/router/auth-guard';

export default {
    name: 'cocina',
    component: () => import(/* webpackChunkName: "cocina" */ '@/modules/cocina/layouts/CocinaLayout.vue'),
    children: [
        {
            path: '/cocina',
            name: 'cocina-principal',
            beforeEnter: [isAuthenticatedCook],
            component: () => import(/* webpackChunkName: "cocina-principal" */ '@/modules/cocina/views/CocinaView.vue')
        },
        {
            path: '/cocina/entrantes',
            name: 'cocina-entrantes-view',
            beforeEnter: [isAuthenticatedCook],
            component: () => import(/* webpackChunkName: "cocina-entrantes-view" */ '@/modules/cocina/views/pedido/EntrantesView.vue')
        },
        {
            path: '/cocina/preparados',
            name: 'cocina-preparados-view',
            beforeEnter: [isAuthenticatedCook],
            component: () => import(/* webpackChunkName: "cocina-preparados-view" */ '@/modules/cocina/views/pedido/PreparadosView.vue')
        }
    ]
}