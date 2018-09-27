<template lang="pug">
    v-footer(height="auto")
        v-layout(justify-center row wrap)
            v-btn(v-for="link in links" :key="link.title" nuxt :to="link.link" flat round) {{link.title}}
            v-flex(py-3 xs12 text-xs-center)
                | &copy; {{ new Date().getFullYear() }} Cagamii
</template>
<script>
  export default {
    data() {
      return {
          links:[
              {title:'お問い合わせ',link:'https://goo.gl/forms/Hd0KxLxd81kDUxRN2'},
              {title:'プライバシー',link:'/privacy'},
              {title:'ご利用規約',link:'/terms'},
              {title:'開発リリース',link:'/release'},
              {title:'クリエーターの方へ',link:'/forcreators'},
              {title:'法人の方へ',link:'/premium'},
          ]
      }
    }
  }
</script>