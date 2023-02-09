<template>
    <div id="principal">
        <div class="row justify-content-center align-items-center" style="height: 90vh">
            <div class="col-auto text-center titulo">
                Vista principal - Administración
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
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
// div::after {
//     content: "";
//     background: url('@/assets/Fondo-Adm.png');
//     background-size: cover;
//     opacity: 0.7;
//     top: 0;
//     left: 0;
//     bottom: 0;
//     right: 0;
//     position: absolute;
//     z-index: -1;
// }
</style>