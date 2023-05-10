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
    <div v-else id="place_map">
        <div class="place-map-panel align-items-center">
            <div class="d-flex justify-content-center align-items-center">
                <div class="my-3 align-center flex-column dining-room">
                    <div class="formulario animate__animated animate__flipInX">
                        <div class="d-flex justify-content-center align-items-center">
                            <div class="panelForm80 mx-5 my-3">
                                <v-select
                                    v-model="diningRoom"
                                    :items="diningRooms"
                                    item-value="id"
                                    item-title="diningRoomNumber"
                                    density="compact"
                                    hide-details="true"
                                    return-object>
                                </v-select>
                            </div>
                            <div class="panelForm20 my-3">
                                <v-btn icon="mdi-map-marker" size="x-small" rounded color="#679A50" @click="initStage()"></v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center align-items-center" style="margin-bottom: 100px">
                <div id="panel-2" class="text-center panel">
                    <div class="justify-content-center align-items-center">
                        <div id="container"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Konva from "konva"
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            isLoading: true,
            diningRoomParameter: 0,
            diningRoom: {
                id: 0,
                diningRoomNumber: ''
            },
            diningRooms: [],
            doorImage: require('@/assets/objects/door.jpg'),
            flowerpotImage: require('@/assets/objects/plant.png'),
            kitchenImage: require('@/assets/objects/kitchen.png'),
            barImage: require('@/assets/objects/bar.png'),
            cashRegisterImage: require('@/assets/objects/cashier-register.png'),
            toiletImage: require('@/assets/objects/toilet.png'),
            rectangularTableImage: require('@/assets/objects/table-rect.png'),
            roundTableImage: require('@/assets/objects/table-circle.png'),
            stage: null,
            layer: null,
            initialWidth: 1029.8646240234375,
            initialHeight: 549.1146240234375,
            stageConfig: {
                container: 'container',
                width: 1,
                height: 1
            },
            stageCreated: false,
            idInterval: 0,
        }
    },
    computed: {
        ...mapState('parametro', ['parameters']),
        ...mapState('mesa', ['tables']),
        ...mapState('posicion_objeto', ['object_position']),
        ...mapGetters('mesa', ['getTablesInOrder']),
        ...mapGetters('posicion_objeto', ['getObjectPositionByDiningRoom']),

        ...mapState('plato', ['categories', 'items_menu']),
        ...mapGetters('plato', ['getItemMenuById']),
        ...mapGetters('area_preparacion', ['getActivePreparationAreas'])
    },
    watch:{
        diningRoom(oldValue, newValue){
            if(oldValue!=newValue) {
                if (this.stageCreated) {
                    clearInterval(this.idInterval)
                    this.layer.destroy()
                    this.layer = null
                    this.stage.destroy()
                    this.stage = null
                    this.stageCreated = false
                }
            }            
        }
    },
    methods: {
        ...mapActions('parametro', ['loadParameters']),
        ...mapActions('mesa', ['loadTables']),
        ...mapActions('posicion_objeto', ['loadObjectsPosition', 'createObjectPosition', 'deleteAllObjectsPosition']),
        async loadStage() {
            await this.loadObjectsPosition()
            const objects = this.getObjectPositionByDiningRoom(this.diningRoom.id)
            if (objects) {
                objects.map(item => {
                    switch(item.name.toUpperCase()) {
                        case 'PUERTA':
                            this.createDoor(item.position_x, item.position_y)
                            break
                        case 'MACETA':
                            this.createFlowerpot(item.position_x, item.position_y)
                            break
                        case 'COCINA':
                            this.createKitchen(item.position_x, item.position_y)
                            break
                        case 'BARRA':
                            this.createBar(item.position_x, item.position_y)
                            break
                        case 'CAJA':
                            this.createCashRegister(item.position_x, item.position_y)
                            break
                        case 'SSHH':
                            this.createToilet(item.position_x, item.position_y)
                            break
                        case 'MESARECT':
                            this.createRectangularTable(item.position_x, item.position_y, item.id_obj_relation, item.state)
                            break
                        case 'MESARED':
                            this.createRoundTable(item.position_x, item.position_y, item.id_obj_relation, item.state)
                            break
                    }
                })
            }
        },
        async initStage() {
            const containerDiv = document.getElementById('panel-2')
            const { width, height } = containerDiv.getBoundingClientRect()
            this.stageConfig.width = width
            this.stageConfig.height = height
            this.stage = new Konva.Stage(this.stageConfig)
            this.layer = new Konva.Layer()
            this.stage.add(this.layer)
            this.stageCreated = true
            await this.loadStage()
            this.idInterval = setInterval(async () => {
                if (this.stageCreated) {
                    this.layer.destroy()
                    this.layer = new Konva.Layer()
                    this.stage.add(this.layer)
                    await this.loadStage()
                }
            }, 1000 * 30);
        },
        createDoor(positionX, positionY) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const door = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 60 * this.stageConfig.width / this.initialWidth,
                        height: 60 * this.stageConfig.width / this.initialWidth,
                        name: 'Puerta'
                    })
                    door.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        door.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })
                    this.layer.add(door)
                    this.layer.draw()
                }
                image.src = this.doorImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createFlowerpot(positionX, positionY) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const flowerpot = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 60 * this.stageConfig.width / this.initialWidth,
                        height: 60 * this.stageConfig.width / this.initialWidth,
                        name: 'Maceta'
                    })
                    flowerpot.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        flowerpot.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })
                    this.layer.add(flowerpot)
                    this.layer.draw()
                }
                image.src = this.flowerpotImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createKitchen(positionX, positionY) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const kitchen = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 180 * this.stageConfig.width / this.initialWidth,
                        height: 180 * this.stageConfig.width / this.initialWidth,
                        name: 'Cocina'
                    })
                    kitchen.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        kitchen.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })
                    this.layer.add(kitchen)
                    this.layer.draw()
                }
                image.src = this.kitchenImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createBar(positionX, positionY) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const bar = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 80 * this.stageConfig.width / this.initialWidth,
                        height: 80 * this.stageConfig.width / this.initialWidth,
                        name: 'Barra'
                    })
                    bar.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        bar.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })
                    this.layer.add(bar)
                    this.layer.draw()
                }
                image.src = this.barImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createCashRegister(positionX, positionY) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const cashRegister = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 80 * this.stageConfig.width / this.initialWidth,
                        height: 80 * this.stageConfig.width / this.initialWidth,
                        name: 'Caja'
                    })
                    cashRegister.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        cashRegister.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })
                    this.layer.add(cashRegister)
                    this.layer.draw()
                }
                image.src = this.cashRegisterImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createToilet(positionX, positionY) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const toilet = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 60 * this.stageConfig.width / this.initialWidth,
                        height: 60 * this.stageConfig.width / this.initialWidth,
                        name: 'SSHH'
                    })
                    toilet.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        toilet.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })
                    this.layer.add(toilet)
                    this.layer.draw()
                }
                image.src = this.toiletImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createRectangularTable(positionX, positionY, idObj = null, state = 0) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const rectangularTable = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 100 * this.stageConfig.width / this.initialWidth,
                        height: 100 * this.stageConfig.width / this.initialWidth,
                        name: 'MesaRect',
                        attrs: {
                            idObj: idObj
                        }
                    })
                    const text = new Konva.Text({
                        x: (positionX * this.stageConfig.width / this.initialWidth) + (0.42 * rectangularTable.width()),
                        y: (positionY * this.stageConfig.height / this.initialHeight) + (0.45 * rectangularTable.height()),
                        text: this.tables.filter(x => x.id == idObj)[0].number,
                        fontSize: 10,
                        fontFamily: 'Calibri',
                        fill: 'white'
                    })
                    const textState = new Konva.Text({
                        x: (positionX * this.stageConfig.width / this.initialWidth) + (0.24 * rectangularTable.width()),
                        y: (positionY * this.stageConfig.height / this.initialHeight),
                        text: (state == 0) ? 'Disponible' : 'Ocupado',
                        fontSize: 12,
                        fontFamily: 'Calibri',
                        fill: 'white'
                    })
                    const rect = new Konva.Rect({
                        x: textState.x() - 5,
                        y: textState.y() - 5,
                        width: textState.width() + 10,
                        height: textState.height() + 10,
                        cornerRadius: 5,
                        fill: (state == 0) ? 'green' : 'red'
                    })
                    const group = new Konva.Group()
                    group.add(rectangularTable)
                    group.add(text)
                    group.add(rect)
                    group.add(textState)

                    rectangularTable.on('dragmove', function() {
                        const pos = rectangularTable.position()
                        text.position({
                            x: pos.x + (0.42 * rectangularTable.width()),
                            y: pos.y + (0.45 * rectangularTable.height())
                        })
                    })

                    group.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        group.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })

                    this.layer.add(group)
                    this.layer.draw()
                }
                image.src = this.rectangularTableImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createRoundTable(positionX, positionY, idObj = null, state = 0) {
            if (this.stageCreated) {
                const image = new Image()
                image.onload = () => {
                    const roundTable = new Konva.Image({
                        x: positionX * this.stageConfig.width / this.initialWidth,
                        y: positionY * this.stageConfig.height / this.initialHeight,
                        image,
                        width: 100 * this.stageConfig.width / this.initialWidth,
                        height: 100 * this.stageConfig.width / this.initialWidth,
                        name: 'MesaRed',
                        attrs: {
                            idObj: idObj
                        }
                    })
                    const text = new Konva.Text({
                        x: (positionX * this.stageConfig.width / this.initialWidth) + (0.42 * roundTable.width()),
                        y: (positionY * this.stageConfig.height / this.initialHeight) + (0.45 * roundTable.height()),
                        text: this.tables.filter(x => x.id == idObj)[0].number,
                        fontSize: window.innerWidth > 900 ? 10 : 9,
                        fontFamily: 'Calibri',
                        fill: 'white'
                    })
                    const textState = new Konva.Text({
                        x: (positionX * this.stageConfig.width / this.initialWidth) + (0.22 * roundTable.width()),
                        y: (positionY * this.stageConfig.height / this.initialHeight) - 10,
                        text: (state == 0) ? 'Disponible' : 'Ocupado',
                        fontSize: window.innerWidth > 900 ? 12 : 9,
                        fontFamily: 'Calibri',
                        fill: 'white'
                    })
                    const rect = new Konva.Rect({
                        x: textState.x() - 5,
                        y: textState.y() - 5,
                        width: textState.width() + 10,
                        height: textState.height() + 10,
                        cornerRadius: 5,
                        fill: (state == 0) ? 'green' : 'red'
                    })
                    const group = new Konva.Group()
                    group.add(roundTable)
                    group.add(text)
                    group.add(rect)
                    group.add(textState)

                    roundTable.on('dragmove', function() {
                        const pos = roundTable.position()
                        text.position({
                            x: pos.x + (0.42 * roundTable.width()),
                            y: pos.y + (0.45 * roundTable.height())
                        })
                    })

                    group.on('dblclick dbltap', () => {
                        // remove the image from the layer
                        group.destroy()
                        // redraw the layer
                        this.layer.draw()
                    })

                    this.layer.add(group)
                    this.layer.draw()
                }
                image.src = this.roundTableImage
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        }
    },
    async mounted() {
        await this.loadTables()
        await this.loadParameters()
        let parameterFound = this.parameters.find(p => p.parameter_code == 1030 && p.item_code == 1031)
        this.diningRoomParameter = parameterFound ? parseInt(parameterFound.value) : 0
        for (let i = 0; i < this.diningRoomParameter; i++) {
            this.diningRooms.push({id: (i + 1), diningRoomNumber: `Salón ${(i + 1)}`})
        }
        this.diningRoom = this.diningRooms[0]
        this.isLoading = false
    },
    unmounted() {
        clearInterval(this.idInterval)
    }
}
</script>

<style lang="scss" scoped>
#place_map {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Ate.png');
    background-size: cover;
}
.place-map-panel {
    width: 100%;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#place_map::-webkit-scrollbar {
    -webkit-appearance: none;
}
#place_map::-webkit-scrollbar:vertical {
    width:1px;
}
#place_map::-webkit-scrollbar-button:increment,#place_map::-webkit-scrollbar-button {
    display: none;
} 
#place_map::-webkit-scrollbar:horizontal {
    height: 10px;
}
#place_map::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3
}
#place_map::-webkit-scrollbar-track {
    border-radius: 10px;
}
#panel-2 {
    background: url('@/assets/objects/background-floor.jpg');
    background-size: cover;
}
.dining-room {
    width: 30%;
}
.img {
  border-radius: 50%;
  max-width: 90%;
  height: auto;
  filter: sepia(50%);
}
.bottom-gradient {
  background-image: linear-gradient(
    to top right, rgba(133, 104, 38,.33), rgba(246, 242, 116,.2)
  );
}
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 300px;
}
.titulo-objetos {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
}
.panel {
    height: 88vh;
    border-right: 1px solid;
    width: 75%;
}
.formulario {
    background-color: rgba(241, 196, 15, 0.6);
    border-radius: 20px;
}
.panelForm80 {
    width: 80%;
}
.panelForm20 {
    width: 20%;
}
.action-wrapper {
    cursor: pointer;
    white-space: nowrap;
}
@media only screen and (max-width: 900px) {
    .place-map-panel {
        width: 600px;
        overflow-x: scroll;
    }
    .panel {
        width: 100%;
    }
    .dining-room {
        width: 90%;
    }
    .formulario {
        margin-left: 1px;
        margin-right: 1px;
    }
    #place_map {
        height: 94vh;
    }
}
</style>