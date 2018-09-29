<template lang="pug">
    v-content
        v-container(grid-list-lg fluid auto)
            v-layout(row wrap)
                v-flex(v-for="(menu,index) in submenu" :key="index" xs6) 
                    v-btn(block full nuxt :to="menu.link" exact)
                        v-icon(block　large left) {{menu.icon}}
                        span {{menu.title}}
        nuxt-child      
</template>

<script>
export default {
    data() {
        return{
            drawer:true,
            submenu:[
                {title:"ダッシュボード",icon:"dashboard",link:"/user"},
                {title:"あたり線",icon:"tablet_mac",link:"/user/app"},
                {title:"ビデオスキップ",icon:"queue_play_next",link:"/user/videoskip"},
                {title:"ポーチの中身",icon:"card_travel",link:"/user/pouch"},
            ]
        }
    },
}
</script>

<style scoped>
.v-btn{
    height: 100px;
}
</style>
