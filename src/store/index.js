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
import kardex from "@/store/almacen/kardex";
import area_preparacion from "@/store/local/area_preparacion";
import parametro from "@/store/parametro";

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
        parametro
    }
})

export default store