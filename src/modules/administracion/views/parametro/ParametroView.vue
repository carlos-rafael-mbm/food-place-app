<template>
    <div class="row justify-content-center align-items-center" style="height: 90vh" v-if="isLoading">
        <div class="col-auto text-center mt-5" style="font-size: 2.5em">
            Espere por favor...
            <h3 class="mt-2">
                <v-progress-circular
                    indeterminate
                    size="100"
                    width="12"
                    color="green">
                </v-progress-circular>
            </h3>
        </div>
    </div>
    <div v-else id="parameter" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-parameter justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Mantenimiento de parámetros"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="control-form justify-content-center mt-5">
                                <div class="left-control">
                                    <v-select
                                        v-model="parameterBase"
                                        :items="parametersBase"
                                        item-value="parameter_code"
                                        item-title="parameter_desc"
                                        :rules="[rules.requiredSelection]"
                                        required
                                        label="Seleccione parámetro"
                                        return-object>
                                    </v-select>
                                </div>
                                <div class="right-control text-center">
                                    <v-select
                                        v-model="parameterItem"
                                        :items="getParameterItems"
                                        item-value="item_code"
                                        item-title="item_desc"
                                        :rules="[rules.requiredSelection]"
                                        required
                                        label="Seleccione ítem"
                                        return-object>
                                    </v-select>
                                </div>
                            </div>
                            <div class="control-form justify-content-center">
                                <div class="left-control">
                                    <v-btn class="my-3" rounded color="#679A50" @click="cargarValorParametro()">Obtener valor</v-btn>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        label="Ingrese valor"
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-alphabetical"
                                        :rules="[rules.required]"
                                        v-model="valueParameter"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 10px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-broom" class="mb-3 mx-4" rounded color="#679A50" @click="limpiarCampos()">Limpiar campos</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-3 mx-5" rounded color="#679A50" @click="actualizarValorParametro">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Swal from "sweetalert2";

export default {
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            parametersBase: [],
            parameterBase: null,
            parameterItem: null,
            valueParameter: '',
            state: true
        }
    },
    computed: {
        ...mapState('parametro', ['parameters', 'isLoading']),
        getParameterItems() {
            let parameterItems = []
            if (this.parameterBase) {
                const itemsByParameter = this.parameters.filter(p => p.parameter_code == this.parameterBase.parameter_code && p.is_editable == 1)
                const uniqueItems = [...new Map(itemsByParameter.map((item) => [item["item_code"], item])).values()]
                parameterItems = uniqueItems.map(p => {
                    const item = {
                        'item_code': p.item_code,
                        'item_desc': p.item_desc
                    }
                    return item
                })
            }
            return parameterItems
        }
    },
    methods: {
        ...mapActions('parametro', ['loadParameters', 'updateParameter']),
        cargarParametros() {
            const uniqueParameters = [...new Map(this.parameters.map((item) => [item["parameter_code"], item])).values()]
            this.parametersBase = uniqueParameters.map(p => {
                const parameter = {
                    'parameter_code': p.parameter_code,
                    'parameter_desc': p.parameter_desc
                }
                return parameter
            })
        },
        async cargarValorParametro() {
            const parameterFound = this.parameters.find(p => p.parameter_code == this.parameterBase.parameter_code && p.item_code == this.parameterItem.item_code)
            this.valueParameter = parameterFound.value
        },
        async limpiarCampos() {
            this.parameterBase = null
            this.parameterItem = null
            this.valueParameter = ''
            this.state = true
            await this.loadParameters()
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async actualizarValorParametro() {
            this.$refs.form.validate()
            if (this.parameterBase.parameter_code == 0 || this.parameterItem.item_code == 0 || !this.valueParameter) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const parameterFound = this.parameters.find(p => p.parameter_code == this.parameterBase.parameter_code && p.item_code == this.parameterItem.item_code)
            const formData = new FormData()
            formData.append('value', this.valueParameter ? this.valueParameter : '')
            const res = await this.updateParameter([parameterFound.id, formData])
            if (res[0] != 0) {
                Swal.fire('Guardado', 'Valor de parámetro actualizado correctamente', 'success')
                this.limpiarCampos()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        }
    },
    async mounted() {
        await this.loadParameters()
        this.cargarParametros()
    }
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 320px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    border-radius: 20px;
}
#parameter {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-parameter {
    width: 50%;
}
.control-form {
    display: flex;
}
.left-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 50%;
}
.right-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 50%;
}
img {
    width: 100px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}
.botonCargar {
    margin-right: 10px;
}
.botonEliminar {
    margin-left: 10px;
}
.fondo-tabla {
    background-color: lighten($color: #856826, $amount: 40);
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#parameter::-webkit-scrollbar {
    -webkit-appearance: none;
}
#parameter::-webkit-scrollbar:vertical {
    width:1px;
}
#parameter::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#parameter::-webkit-scrollbar:horizontal {
    height: 10px;
}
#parameter::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#parameter::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 950px) {
    /* For mobile phones: */
    .panel-parameter {
        width: 90%;
    }
    #formulario {
        width: 96%;
        margin-left: 0px;
        margin-right: 0px;
    }
    .control-form {
        display: block;
    }
    .left-control {
        margin-left: 0.3em;
        margin-right: 0.6em;
        width: 97%;
    }
    .right-control {
        margin-left: 0.3em;
        margin-right: 0.6em;
        width: 97%;
    }
    .botonCargar {
        margin-right: 1px;
    }
    .botonEliminar {
        margin-left: 1px;
    }
}
</style>