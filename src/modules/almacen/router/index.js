import {isAuthenticatedStorekeeper} from '@/modules/autenticacion/router/auth-guard';

export default {
    name: 'almacen',
    component: () => import(/* webpackChunkName: "almacen" */ '@/modules/almacen/layouts/AlmacenLayout.vue'),
    children: [
        {
            path: '/almacen',
            name: 'almacen-principal',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-principal" */ '@/modules/almacen/views/AlmacenView.vue')
        },
        {
            path: '/almacen/categorias',
            name: 'alm-category-view',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-category-view" */ '@/modules/almacen/views/categoria/CategoriaInsumoView.vue')
        },
        {
            path: '/almacen/unidades-medida',
            name: 'alm-unit-view',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-unit-view" */ '@/modules/almacen/views/unidad_medida/UnidadMedidaView.vue')
        },
        {
            path: '/almacen/insumos',
            name: 'alm-supply-view',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-supply-view" */ '@/modules/almacen/views/insumo/InsumoView.vue')
        },
        {
            path: '/almacen/almacenes',
            name: 'alm-warehouse-view',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-warehouse-view" */ '@/modules/almacen/views/almacen/AlmacenView.vue')
        },
        {
            path: '/almacen/insumos-almacen',
            name: 'alm-supplies-warehouse-view',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-supplies-warehouse-view" */ '@/modules/almacen/views/almacen/InsumoAlmacenView.vue')
        },
        {
            path: '/almacen/entradas',
            name: 'alm-entry-view',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-entry-view" */ '@/modules/almacen/views/kardex/EntradaView.vue')
        },
        {
            path: '/almacen/conteo-existencias',
            name: 'alm-stock-count-view',
            beforeEnter: [isAuthenticatedStorekeeper],
            component: () => import(/* webpackChunkName: "almacen-stock-count-view" */ '@/modules/almacen/views/kardex/SalidaView.vue')
        }
    ]
}