import {isAuthenticatedCashier} from '@/modules/autenticacion/router/auth-guard';

export default {
    name: 'caja',
    component: () => import(/* webpackChunkName: "caja" */ '@/modules/caja/layouts/CajaLayout.vue'),
    children: [
        {
            path: '/caja',
            name: 'caja-principal',
            beforeEnter: [isAuthenticatedCashier],
            component: () => import(/* webpackChunkName: "caja-principal" */ '@/modules/caja/views/CajaView.vue')
        },
        {
            path: '/caja/apertura',
            name: 'caja-beginning-view',
            beforeEnter: [isAuthenticatedCashier],
            component: () => import(/* webpackChunkName: "caja-beginning-view" */ '@/modules/caja/views/apertura/AperturaView.vue')
        },
        {
            path: '/caja/movimientos',
            name: 'caja-movement-view',
            beforeEnter: [isAuthenticatedCashier],
            component: () => import(/* webpackChunkName: "caja-movement-view" */ '@/modules/caja/views/movimiento/MovimientoView.vue')
        },
        {
            path: '/caja/cobro',
            name: 'caja-cobro-view',
            beforeEnter: [isAuthenticatedCashier],
            component: () => import(/* webpackChunkName: "caja-cobro-view" */ '@/modules/caja/views/cobro/CobroView.vue')
        },
        {
            path: '/caja/consulta-estado',
            name: 'caja-consultation-view',
            beforeEnter: [isAuthenticatedCashier],
            component: () => import(/* webpackChunkName: "caja-consultation-view" */ '@/modules/caja/views/consulta/ConsultaView.vue')
        },
        {
            path: '/caja/cierre',
            name: 'caja-closing-view',
            beforeEnter: [isAuthenticatedCashier],
            component: () => import(/* webpackChunkName: "caja-closing-view" */ '@/modules/caja/views/cierre/CierreView.vue')
        }
    ]
}