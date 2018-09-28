<template lang="pug">
  v-app
    v-toolbar(flat color="")
        v-toolbar-title
          nuxt-link(nuxt to="/") Cagamii
        v-spacer
        v-toolbar-items
          v-btn(to="/login" v-if="!user" flat) ログイン
          v-menu(offset-y open-on-hover)
            v-btn(slot="activator" icon to="/user") 
              v-icon(v-if="!user") menu
              v-avatar(size="36px" v-else)
                img(v-if="user.photoURL" :src="user.photoURL")
                template(v-if="!user.photoURL") {{user.email[0]}}
            v-list
              v-list-tile(nuxt to="/beginner"): v-list-tile-title はじめての方へ
              v-list-tile(to="/login" v-if="!user"): v-list-tile-title ログイン
              v-divider(v-if="user")
              v-list-tile(@click="logout" v-if="user"): v-list-tile-title ログアウト
    nuxt
    Footer
</template>

<script>
import Footer from '~/components/Footer'
export default {
  components: {
    Footer
  },
  data() {
    return{
      user: this.$store.state.user,
    }
  },
  methods: {
    logout() {
      this.$firebase
        .auth()
        .signOut()
        .then(() => {
          console.log('ログアウト成功');
          location.href = '/';
        });
    }
  }

  
}
</script>