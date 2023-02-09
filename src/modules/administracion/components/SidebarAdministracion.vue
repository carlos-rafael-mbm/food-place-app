<template>
    <div class="sidebar-container">
        <div class="pt-1"></div>
        <div class="sidebar-item pointer my-3 mx-2" @click="$router.push({name: 'adm-category-view'})">
            <h2>Categorías</h2>
        </div>
        <div class="sidebar-item pointer my-3 mx-2">
            <h2>Platos/Bedidas</h2>
        </div>
        <div class="sidebar-item pointer my-3 mx-2">
            <h2>Carta</h2>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.sidebar-container {
    border-right: 1px solid #2c3e50;
    // background-color: lighten($color: #F1C40F, $amount: 30);
    background-image: url('@/assets/img/sidebar-1.jpg');
    height: 90vh //calc(100vh - 58px);
}
.sidebar-item {
    border-radius: 30px;
    background-color: lighten($color: #679A50, $amount: 1);
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    h2 {
        color: lighten($color: #F1C40F, $amount: 50);
        font-weight: 400;
        font-size: 24px;
    }
    &:hover {
        background-color: lighten($color: #F1C40F, $amount: 50);
        transition: 0.2s all ease-in;
        border: 2px solid #679A50;
        h2 {
            color: #679A50;
        }
    }
}
</style>