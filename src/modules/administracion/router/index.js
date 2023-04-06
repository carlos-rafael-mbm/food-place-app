import {isAuthenticatedAdmin} from '@/modules/autenticacion/router/auth-guard';

export default {
    name: 'administracion',
    component: () => import(/* webpackChunkName: "administracion" */ '@/modules/administracion/layouts/AdministracionLayout.vue'),
    children: [
        {
            path: '/administracion',
            name: 'administracion-principal',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-principal" */ '@/modules/administracion/views/AdministracionView.vue')
        },
        {
            path: '/administracion/categorias',
            name: 'adm-category-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-category-view" */ '@/modules/administracion/views/categoria/CategoriaView.vue')
        },
        {
            path: '/administracion/item-menu',
            name: 'item-menu-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-item-menu-view" */ '@/modules/administracion/views/item_menu/ItemMenuView.vue')
        },
        {
            path: '/administracion/menu',
            name: 'adm-menu-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-menu-view" */ '@/modules/administracion/views/menu/MenuView.vue')
        },
        {
            path: '/administracion/promos',
            name: 'adm-promo-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-promo-view" */ '@/modules/administracion/views/promocion/PromocionView.vue')
        },
        {
            path: '/administracion/areas-preparacion',
            name: 'adm-preparation-area-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-preparation-area-view" */ '@/modules/administracion/views/area_preparacion/AreaPreparacionView.vue')
        },
        {
            path: '/administracion/mesas',
            name: 'adm-table-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-table-view" */ '@/modules/administracion/views/mesa/MesaView.vue')
        },
        {
            path: '/administracion/metodos-pago',
            name: 'adm-payment-method-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-payment-method-view" */ '@/modules/administracion/views/metodo_pago/MetodoPagoView.vue')
        },
        {
            path: '/administracion/cajas-registradoras',
            name: 'adm-cash-register-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-cash-register-view" */ '@/modules/administracion/views/caja_registradora/CajaRegistradoraView.vue')
        },
        {
            path: '/administracion/clientes',
            name: 'adm-client-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-client-view" */ '@/modules/administracion/views/cliente/ClienteView.vue')
        },
        {
            path: '/administracion/empleados',
            name: 'adm-employee-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-employee-view" */ '@/modules/administracion/views/empleado/EmpleadoView.vue')
        },
        {
            path: '/administracion/usuarios',
            name: 'adm-user-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-user-view" */ '@/modules/administracion/views/usuario/UsuarioView.vue')
        },
        {
            path: '/administracion/parametros',
            name: 'adm-parameter-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-parameter-view" */ '@/modules/administracion/views/parametro/ParametroView.vue')
        },
        {
            path: '/administracion/reporte-ventas',
            name: 'adm-sale-report-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-sale-report-view" */ '@/modules/administracion/views/reporte/ReportePedidoView.vue')
        },
        {
            path: '/administracion/dashboard-ventas',
            name: 'adm-dashboard-view',
            beforeEnter: [isAuthenticatedAdmin],
            component: () => import(/* webpackChunkName: "administracion-dashboard-view" */ '@/modules/administracion/views/dashboard/DashboardView.vue')
        }
    ]
}