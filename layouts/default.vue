<template lang="pug">
  v-app
    v-toolbar(flat color="")
        v-toolbar-title
          nuxt-link(nuxt to="/") Cagamii
        v-spacer
        v-toolbar-items
          v-btn(nuxt to="beginner" flat) はじめての方へ
          v-btn(nuxt to="login" flat v-if="!user") ログイン
          v-btn(icon nuxt to="/user")
            v-avatar: img(:src="user.photoURL")
          v-menu(offset-y)
            v-btn(slot="activator" icon) 
              v-icon menu
            v-list
              v-list-tile(
                v-for="(item, index) in items"
                :key="index"
                @click=""
              )
                v-list-tile-title {{ item.title }}
    nuxt
    Footer
</template>

<script>
import Footer from '~/components/Footer'
export default {
  middleware: ['auth'],
  components: {
    Footer
  },
  data() {
    return{
      user: this.$store.state.user,
      items:[
        {title:"アカウント管理"},
        {title:"ログアウト"}
      ]
    }
  },
  mounted(){
  },
}
</script>