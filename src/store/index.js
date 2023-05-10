import { createStore } from "vuex"
import plato from "@/store/menu/plato"
import carta from "@/store/menu/carta"
import empleado from "@/store/local/empleado"
import mesa from "@/store/local/mesa"
import cliente from "@/store/local/cliente"
import usuario from "@/store/autenticacion/usuario"
import login from "@/store/autenticacion/login"
import pedido from "@/store/atencion/pedido"
import promocion from "@/store/atencion/promocion"
import categoria_insumo from "@/store/almacen/insumo/categoria"
import unidad_medida from "@/store/almacen/insumo/unidad_medida"
import insumo from "@/store/almacen/insumo/insumo"
import almacen from "@/store/almacen/insumo/almacen"
import kardex from "@/store/almacen/kardex"
import area_preparacion from "@/store/local/area_preparacion"
import parametro from "@/store/parametro"
import caja_registradora from "@/store/local/caja_registradora"
import asignacion_cajero from "@/store/caja/asignacion_cajero"
import movimiento_caja from "@/store/caja/movimiento"
import balance_caja from "@/store/caja/balance"
import metodo_pago from "@/store/local/metodo_pago"
import comprobante from "@/store/caja/voucher"
import control_insumo from "@/store/almacen/control_insumo"

const store = createStore({
    modules: {
        plato,
        carta,
        empleado,
        mesa,
        cliente,
        usuario,
        login,
        pedido,
        promocion,
        categoria_insumo,
        unidad_medida,
        insumo,
        almacen,
        kardex,
        area_preparacion,
        parametro,
        caja_registradora,
        asignacion_cajero,
        movimiento_caja,
        balance_caja,
        metodo_pago,
        comprobante,
        control_insumo
    }
})

export default store