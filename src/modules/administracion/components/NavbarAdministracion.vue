<template>
    <nav class="navbar">
        <a class="navbar-brand">
            <img src="@/assets/logo.jpg" alt="La Esencia" height="30" class="d-inline-block align-text-top mx-2">
            La Esencia - Módulo de Administración
        </a>
        <div class="d-flex">
            <button class="btn btn-outline-success mx-2" @click="$router.push({name: 'home'})">
                <i class="fa fa-sign-out-alt"></i>
            </button>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
nav {
    background-color: lighten($color: #F1C40F, $amount: 10);
}
</style>