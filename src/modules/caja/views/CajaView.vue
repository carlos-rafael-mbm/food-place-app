<template>
    <div id="principal">
        <div class="row justify-content-center align-items-center" style="height: 90vh">
            <div class="col-auto text-center titulo">
                Vista principal - Caja
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.titulo {
    background-color: #856826;
    border-radius: 20px;
    border: 5px solid #F1C40F;
    user-select: none;
    font-size: 28px;
    width: 60%;
    color: white;
}
#principal {
    height: 100vh;
    background: url('@/assets/Fondo-Caja.png');
    background-size: cover;
}
</style>