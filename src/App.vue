<template>
  <router-view/>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('login', ['checkAuthentication'])
  },
  mounted() {
    this.checkAuthentication()
  }
}
</script>