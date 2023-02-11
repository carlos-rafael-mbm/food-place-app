<template>
  <v-parallax :src="require('@/assets/Fondo-La-Esencia.jpg')">
    <div class="position-absolute top-0 end-0">
      <v-btn icon="mdi-logout" class="mx-2 my-2" color="#F1C40F" rounded @click="logout()"></v-btn>
    </div>
    <div id="esencia-principal" class="vh-100 row justify-content-center align-items-center">
      <div class="col-12 text-center">
        <img alt="Empresa" src="../assets/logo.jpg" height="200">
        <h1 class="text-light my-3 titulo">Bienvenidos al sistema de {{ getRazonSocial }}</h1>
        <v-btn v-if="user.role && user.role.id == 1" prepend-icon="mdi-account-tie-hat" class="boton" rounded color="#F1C40F" size="large" @click="ir_Administracion">Administración</v-btn>
        <v-btn v-if="user.role && (user.role.id == 1 || user.role.id == 2)" prepend-icon="mdi-text-box-edit" class="boton" rounded color="#856826" size="large" @click="ir_Atencion">Atención</v-btn>
        <v-btn v-if="user.role && (user.role.id == 1 || user.role.id == 3)" prepend-icon="mdi-chef-hat" class="boton" rounded color="#679A50" size="large" @click="ir_Cocina">Cocina</v-btn>
        <v-btn v-if="user.role && user.role.id == 1" prepend-icon="mdi-cash-register" class="boton" rounded color="#E3CD83" size="large" @click="ir_Caja">Caja</v-btn>
        <v-btn v-if="user.role && user.role.id == 1" prepend-icon="mdi-store-cog" class="boton" rounded color="#E75D48" size="large" @click="ir_Almacen">Almacén</v-btn>
      </div>
      <div class="texto text-center">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="text-center panel-title">
              ¿Qué es la Esencia?
            </v-expansion-panel-title>
            <v-expansion-panel-text class="panel-text">
              Siempre quisimos encontrar el nombre correcto para La Esencia, faltaba el apellido. No ofrecemos cafe, así que, no somos una cafetería, tampoco bebidas alcohólicas, ni comida, sólo algunos postres y piqueos, siendo nuestro producto insignia los mates ¿seríamos entonces una matería?
              Ya en otra entrada explicaremos lo difícil que fue ofrecer sólo mates y como empezamos. Por ahora les contaré que en busca del apellido, me topé con los corrales de comedia, populares entre los siglos XVI y XVII en España, donde las presentaciones teatrales y artísticas se realizaban en una parte del patio, mientras el público observaba desde sus asientos o los balcones alrededor de estas casonas de dos a tres pisos.
              En estos recintos, atiborrados de gente, con artistas y creadores emergentes y en plena época de oro del teatro español, fue donde los árabes emigrantes trajeron la Aloxa, después llamada Aloja, bebida en base a agua, hierbas, especias y miel (algunos le ponían vino, cosa que no estaba permitida en los Corrales de Comedia).
              Ellos se ubicaban en la parte posterior del patio (después llamada alojería) donde preparaban sus matecitos y los vendían entre el público asistente. Es así que tradicionalmente los matecitos y el teatro están ligados y encontramos nuestro apellido.
              Seguimos una tradición casi perdida y reencontrada por casualidad. Y es que a veces, la memoria de nuestra historia deambula en el aire hasta hacerse escuchar.
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </v-parallax>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
// @ is an alias to /src

export default {
  name: 'HomeView',
  data() {
    return {
      user: {
        username: '',
        password: '',
        state: true,
        role: null,
        employee: null
      }
    }
  },
  computed: {
    ...mapState('parametro', ['parameters']),
    ...mapGetters('login', ['getUser']),
    getRazonSocial() {
      const parameterFound = this.parameters.find(p => p.parameter_code == 1000 && p.item_code == 1002)
      return parameterFound ? parameterFound.value : ''
    }
  },
  methods: {
    ...mapActions('login', ['logoutUser']),
    ...mapActions('parametro', ['loadParameters']),
    ir_Administracion() {
      this.$router.push({ name: 'administracion-principal' })
    },
    ir_Atencion() {
      this.$router.push({ name: 'atencion-principal' })
    },
    ir_Cocina() {
      this.$router.push({ name: 'cocina-principal' })
    },
    ir_Caja() {
      this.$router.push({ name: 'caja-principal' })
    },
    ir_Almacen() {
      this.$router.push({ name: 'almacen-principal' })
    },
    logout() {
      this.logoutUser()
      this.$router.push({name: 'login'})
    }
  },
  async mounted() {
    this.user = this.getUser
    await this.loadParameters()
  }
}
</script>

<style lang="scss" scoped>
#esencia-principal {
  overflow-y: auto;
}
img {
  border: 5px solid #F1C40F;
  border-radius: 50%;
}
h1 {
  background-color: #856826;
  border-radius: 20px;
  border: 5px solid #F1C40F;
  user-select: none;
  font-size: 28px;
}
.boton {
  margin: 20px;
}
.texto {
  width: 40%;
}
.panel-title {
  background-color: #679A50;
  color: white
}
.panel-text {
  background-color: lighten($color: #856826, $amount: 40);
  font-size: small;
  text-align: justify;
}
.titulo {
  margin: 0px 250px;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#esencia-principal::-webkit-scrollbar {
    -webkit-appearance: none;
}
#esencia-principal::-webkit-scrollbar:vertical {
    width:1px;
}
#esencia-principal::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#esencia-principal::-webkit-scrollbar:horizontal {
    height: 10px;
}
#esencia-principal::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#esencia-principal::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media only screen and (max-width: 950px) {
  .titulo {
    margin: 0px 100px;
  }
  .texto {
    width: 60%;
  }
}
@media only screen and (max-width: 500px) {
  .titulo {
    margin: 0px 10px;
  }
  .texto {
    width: 85%;
  }
}
</style>
