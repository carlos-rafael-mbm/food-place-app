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
        <div class="row">
            <div id="panel-1" class="text-center panel" style="width:20%">
                <div class="formulario mx-1 mt-2 animate__animated animate__flipInX">
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm80 ms-4 mt-3">
                            <v-select
                                v-model="diningRoom"
                                :items="diningRooms"
                                item-value="id"
                                item-title="diningRoomNumber"
                                density="compact"
                                hint="Selecciona un salón"
                                persistent-hint
                                return-object>
                            </v-select>
                        </div>
                        <div class="panelForm20 mt-3">
                            <v-btn icon="mdi-map-marker" size="x-small" rounded color="#679A50" @click="initStage()"></v-btn>
                        </div>
                    </div>
                    <hr style="border-top: 5px solid; margin-bottom: 1px">
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm mt-1">
                            <v-card
                                title="Objetos"
                                class="text-center text-light titulo-objetos"
                            ></v-card>
                        </div>
                    </div>
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm25 ms-4 mt-3">
                            <v-img :src="doorImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createDoor(0, 0)"></v-btn>
                        </div>
                        <div class="panelForm25 mt-3">
                            <v-img :src="flowerpotImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createFlowerpot(0, 0)"></v-btn>
                        </div>
                    </div>
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm25 ms-4 mt-3">
                            <v-img :src="kitchenImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createKitchen(0, 0)"></v-btn>
                        </div>
                        <div class="panelForm25 mt-3">
                            <v-img :src="barImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createBar(0, 0)"></v-btn>
                        </div>
                    </div>
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm25 ms-4 mt-3">
                            <v-img :src="cashRegisterImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createCashRegister(0, 0)"></v-btn>
                        </div>
                        <div class="panelForm25 mt-3">
                            <v-img :src="toiletImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createToilet(0, 0)"></v-btn>
                        </div>
                    </div>
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm100 mx-4 mt-3">
                            <v-select
                                v-model="table"
                                :items="tables"
                                item-value="id"
                                item-title="number"
                                density="compact"
                                hint="Selecciona una mesa"
                                persistent-hint
                                return-object>
                            </v-select>
                        </div>
                    </div>
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm25 ms-4 mt-3">
                            <v-img :src="rectangularTableImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createRectangularTable(0, 0)"></v-btn>
                        </div>
                        <div class="panelForm25 mt-3">
                            <v-img :src="roundTableImage" width="40"></v-img>
                        </div>
                        <div class="panelForm25 mt-3 text-left">
                            <v-btn icon="mdi-plus" size="x-small" rounded color="#679A50" @click="createRoundTable(0, 0)"></v-btn>
                        </div>
                    </div>
                    <hr style="border-top: 5px solid; margin-bottom: 1px">
                    <div class="panelFormBase justify-content-center align-items-center">
                        <div class="panelForm100 ms-4 my-2">
                            <v-btn prepend-icon="mdi-content-save" class="mt-1 mx-5" rounded color="#679A50" @click="guardarLienzo">Guardar</v-btn>
                        </div>
                    </div>
                </div>
            </div>
            <div id="panel-2" class="text-center d-flex justify-content-center panel" style="width:80%">
                <div class="justify-content-center align-items-center">
                    <div id="container"></div>
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
            table: null
        }
    },
    computed: {
        ...mapState('parametro', ['parameters']),
        ...mapState('mesa', ['tables']),
        ...mapState('posicion_objeto', ['object_position']),
        ...mapGetters('mesa', ['getTablesInOrder']),
        ...mapGetters('posicion_objeto', ['getObjectPositionByDiningRoom'])
    },
    watch:{
        diningRoom(oldValue, newValue){
            if(oldValue!=newValue) {
                if (this.stageCreated) {
                    this.layer.destroy()
                    this.layer = null
                    this.stage.destroy()
                    this.stage = null
                    this.stageCreated = false
                    this.table = null
                }
            }            
        }
    },
    methods: {
        ...mapActions('parametro', ['loadParameters']),
        ...mapActions('mesa', ['loadTables']),
        ...mapActions('posicion_objeto', ['loadObjectsPosition', 'createObjectPosition', 'deleteAllObjectsPosition']),
        nuevoItemMenu() {
            this.localImage = null
            this.file = null
            this.item_menu.id = 0
            this.item_menu.name = ''
            this.item_menu.brief = ''
            this.item_menu.image = ''
            this.item_menu.cost = 0
            this.item_menu.state = true
            this.item_menu.category = null
            this.item_menu.preparation_area = null
            this.searchField = ''
            this.searchValue = ''
            this.disabled = false
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200)
        },
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
                            this.createRectangularTable(item.position_x, item.position_y, item.id_obj_relation)
                            break
                        case 'MESARED':
                            this.createRoundTable(item.position_x, item.position_y, item.id_obj_relation)
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
                        draggable: true,
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
                        draggable: true,
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
                        draggable: true,
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
                        draggable: true,
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
                        draggable: true,
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
                        draggable: true,
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
        createRectangularTable(positionX, positionY, idObj = null) {
            if (this.stageCreated) {
                if (this.table || (positionX > 0 && positionY > 0)) {
                    const image = new Image()
                    image.onload = () => {
                        const rectangularTable = new Konva.Image({
                            x: positionX * this.stageConfig.width / this.initialWidth,
                            y: positionY * this.stageConfig.height / this.initialHeight,
                            image,
                            width: 100 * this.stageConfig.width / this.initialWidth,
                            height: 100 * this.stageConfig.width / this.initialWidth,
                            draggable: true,
                            name: 'MesaRect',
                            attrs: {
                                idObj: (this.table) ? this.table.id : idObj
                            }
                        })
                        const text = new Konva.Text({
                            x: (positionX * this.stageConfig.width / this.initialWidth) + (0.42 * rectangularTable.width()),
                            y: (positionY * this.stageConfig.height / this.initialHeight) + (0.45 * rectangularTable.height()),
                            text: (this.table) ? this.table.number : this.tables.filter(x => x.id == idObj)[0].number,
                            fontSize: 10,
                            fontFamily: 'Calibri',
                            fill: 'white'
                        })
                        const group = new Konva.Group()
                        group.add(rectangularTable)
                        group.add(text)

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
                    Swal.fire('Error', 'Seleccione una mesa', 'error')
                }
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        createRoundTable(positionX, positionY, idObj = null) {
            if (this.stageCreated) {
                if (this.table || (positionX > 0 && positionY > 0)) {
                    const image = new Image()
                    image.onload = () => {
                        const roundTable = new Konva.Image({
                            x: positionX * this.stageConfig.width / this.initialWidth,
                            y: positionY * this.stageConfig.height / this.initialHeight,
                            image,
                            width: 100 * this.stageConfig.width / this.initialWidth,
                            height: 100 * this.stageConfig.width / this.initialWidth,
                            draggable: true,
                            name: 'MesaRed',
                            attrs: {
                                idObj: (this.table) ? this.table.id : idObj
                            }
                        })
                        const text = new Konva.Text({
                            x: (positionX * this.stageConfig.width / this.initialWidth) + (0.42 * roundTable.width()),
                            y: (positionY * this.stageConfig.height / this.initialHeight) + (0.45 * roundTable.height()),
                            text: (this.table) ? this.table.number : this.tables.filter(x => x.id == idObj)[0].number,
                            fontSize: 10,
                            fontFamily: 'Calibri',
                            fill: 'white'
                        })
                        const group = new Konva.Group()
                        group.add(roundTable)
                        group.add(text)

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
                    Swal.fire('Error', 'Seleccione una mesa', 'error')
                }
            } else {
                Swal.fire('Error', 'Seleccione un salón', 'error')
            }
        },
        async guardarLienzo() {
            const doors = this.layer.find('.Puerta')
            const flowerpots = this.layer.find('.Maceta')
            const kitchens = this.layer.find('.Cocina')
            const bars = this.layer.find('.Barra')
            const cashRegisters = this.layer.find('.Caja')
            const toilets = this.layer.find('.SSHH')
            const rectangularTables = this.layer.find('.MesaRect')
            const roundTables = this.layer.find('.MesaRed')
            const objects = []
            doors.map(door => {
                const { x, y } = door.position()
                const object = {
                    'name': 'Puerta',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': 0
                }
                objects.push(object)
            })
            flowerpots.map(flowerpot => {
                const { x, y } = flowerpot.position()
                const object = {
                    'name': 'Maceta',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': 0
                }
                objects.push(object)
            })
            kitchens.map(kitchen => {
                const { x, y } = kitchen.position()
                const object = {
                    'name': 'Cocina',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': 0
                }
                objects.push(object)
            })
            bars.map(bar => {
                const { x, y } = bar.position()
                const object = {
                    'name': 'Barra',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': 0
                }
                objects.push(object)
            })
            cashRegisters.map(cashRegister => {
                const { x, y } = cashRegister.position()
                const object = {
                    'name': 'Caja',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': 0
                }
                objects.push(object)
            })
            toilets.map(toilet => {
                const { x, y } = toilet.position()
                const object = {
                    'name': 'SSHH',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': 0
                }
                objects.push(object)
            })
            rectangularTables.map(rectTable => {
                const { x, y } = rectTable.position()
                const object = {
                    'name': 'MesaRect',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': rectTable.getAttr('idObj')
                }
                objects.push(object)
            })
            roundTables.map(rndTable => {
                const { x, y } = rndTable.position()
                const object = {
                    'name': 'MesaRed',
                    'positionX': x,
                    'positionY': y,
                    'diningRoomNumber': this.diningRoom.id,
                    'idObjRelation': rndTable.getAttr('idObj')
                }
                objects.push(object)
            })
            const {isConfirmed} = await Swal.fire({
                title: 'Listos para crear el nuevo mapa',
                text: '¿Has terminado de crear el mapa del sitio de comida?',
                showDenyButton: true,
                denyButtonColor: '#E75D48',
                denyButtonText: ' <i class="fa fa-thumbs-down"></i>  No, mejor no',
                confirmButtonColor: '#679A50',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i>  Sí, estoy seguro',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                background: '#F7F5B2'
            })
            if (isConfirmed) {
                new Swal({
                    title: 'Espere por favor',
                    allowOutsideClick: false
                })
                Swal.showLoading()
                try {
                    await this.deleteAllObjectsPosition(this.diningRoom.id)
                    let countErrors = 0
                    for (const item of objects) {
                        const formData = new FormData()
                        formData.append('name', item.name)
                        formData.append('position_x', item.positionX)
                        formData.append('position_y', item.positionY)
                        formData.append('dining_room_number', item.diningRoomNumber)
                        if (item.idObjRelation != 0) {
                            formData.append('id_obj_relation', item.idObjRelation)
                            formData.append('state', 0)
                        }
                        const res = await this.createObjectPosition(formData)
                        if (res[0] == 0) {
                            countErrors++
                        }
                    }
                    if (countErrors > 0) {
                        Swal.fire('Terminado', 'El mapa se ha creado con errores. Por favor, recarga la página para validar qué elementos se crearon correctamente', 'warning')
                    }
                    else {
                        Swal.fire('Terminado', 'El mapa se creó con éxito', 'success')
                    }
                } catch (error) {
                    Swal.fire('Error', 'El mapa no pudo ser creado.', 'error')
                }
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
    }
}
</script>

<style lang="scss" scoped>
#place_map {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
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
    // position: fixed
}
.formulario {
    background-color: rgba(241, 196, 15, 0.6);
    // width: 50%
    border-radius: 20px;
}
.panelFormBase {
    display: flex !important;
}
.panelForm {
    margin-left: 4px;
    margin-right: 4px;
    width: 50%;
}
.panelForm100 {
    margin-left: 4px;
    margin-right: 4px;
    width: 100%;
}
.panelForm80 {
    width: 80%;
}
.panelForm20 {
    width: 20%;
}
.panelForm25 {
    width: 25%;
}
.action-wrapper {
    cursor: pointer;
    white-space: nowrap;
}
select {
    background-image:
        linear-gradient(45deg, transparent 50%, green 50%),
        linear-gradient(135deg, green 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
    background-position:
        calc(100% - 18px) calc(1em + 2px),
        calc(100% - 13px) calc(1em + 2px),
        calc(100% - 2.5em) 0.5em;
    background-size:
        5px 5px,
        5px 5px,
        1px 1.5em;
    background-repeat: no-repeat;
}
@media only screen and (max-width: 500px) {
    .panel {
        display: none;
    }
    #auxiliar {
        display: none;
    }
    .formulario {
        margin-left: 1px;
        margin-right: 1px;
        width: 90%;
    }
    .panelFormBase {
        display: block !important;
    }
    .panelForm {
        margin-left: 1px;
        margin-right: 1px;
        width: 100%;
    }
    #tablaItemsMenu {
        width: 90%;
    }
    #place_map {
        height: 94vh;
    }
}
</style>