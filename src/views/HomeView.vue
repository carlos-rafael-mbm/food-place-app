<template>
  <v-parallax :src="require('@/assets/Fondo-Principal.jpg')">
    <div class="position-absolute top-0 end-0">
      <v-btn icon="mdi-logout" class="mx-2 my-2" color="#F1C40F" rounded @click="logout()"></v-btn>
    </div>
    <div id="esencia-principal" class="vh-100 justify-content-center align-items-center">
      <div class="col-12 text-center mt-13">
        <img alt="Empresa" src="../assets/logo.png" height="200">
        <h1 class="text-light my-3 titulo">Bienvenidos al sistema de {{ getRazonSocial }}</h1>
        <v-btn v-if="user.role && (user.role.id == 1 || user.role.id == 9 || user.role.id == 6)" prepend-icon="mdi-account-tie-hat" class="boton" rounded color="#F1C40F" size="large" @click="ir_Administracion">Administración</v-btn>
        <v-btn v-if="user.role && (user.role.id == 1 || user.role.id == 9 || user.role.id == 2)" prepend-icon="mdi-text-box-edit" class="boton" rounded color="#856826" size="large" @click="ir_Atencion">Atención</v-btn>
        <v-btn v-if="isVirtualCommand && (user.role && (user.role.id == 1 || user.role.id == 9 || user.role.id == 3 || user.role.id == 10 || user.role.id == 11 || user.role.id == 12))" prepend-icon="mdi-chef-hat" class="boton" rounded color="#679A50" size="large" @click="ir_Cocina">Cocina</v-btn>
        <v-btn v-if="user.role && (user.role.id == 1 || user.role.id == 9 || user.role.id == 4)" prepend-icon="mdi-cash-register" class="boton" rounded color="#E3CD83" size="large" @click="ir_Caja">Caja</v-btn>
        <v-btn v-if="user.role && (user.role.id == 1 || user.role.id == 9 || user.role.id == 5 || user.role.id == 13)" prepend-icon="mdi-store-cog" class="boton" rounded color="#E75D48" size="large" @click="ir_Almacen">Almacén</v-btn>
      </div>
      <div class="mx-auto my-12 texto text-center">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="text-center panel-title">
              ¿Qué es el Sistema de Gestión de sitios de comida?
            </v-expansion-panel-title>
            <v-expansion-panel-text class="panel-text">
              Es un sistema dinámico, versátil, intuitivo, perfecto para gestionar los procesos más importantes de un sitio de comidas (restaurantes, cafeterías, pastelerías, bares, fast food, etc.)
              <br>
              Cada uno de estos procesos se despliega en nuestros 5 módulos: Administración, Atención, Cocina, Caja y Almacén. De esta manera el usuario tiene todo diferenciado, para evitar confusiones
              y tener un manejo intuitivo y adecuado.
              <br>
              Además, cuenta con un sistema de control de usuarios y roles, que le da seguridad al sistema, evitando que usuarios no autenticados tengan acceso a información privada del negocio, así mismo,
              que usuarios sin el permiso necesario accedan a información que no corresponda a sus funciones.
              <br>
              --
              <br>
              Este software es propiedad de Gnosyst Group. Para más información, comuníquese al: 952441897 - 967761744
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
      isVirtualCommand: false,
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
    let parameterFound = this.parameters.find(p => p.parameter_code == 1030 && p.item_code == 1032)
    this.isVirtualCommand = parameterFound ? (parameterFound.value === '0' ? false : true) : false
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
  margin: 0px 15rem;
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
