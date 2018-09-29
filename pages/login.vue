<template lang="pug">
    v-container
        v-layout(flex align-center justify-center)
            #firebaseui-auth-container
            #loader
</template>

<script>
var firebase = require('firebase');
var firebaseui = require('firebaseui');

export default {
    mounted(){
        require('firebaseui/dist/firebaseui.css');
        let ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        ui.start('#firebaseui-auth-container', {
        signInSuccessUrl:"/user",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        });
    }
}
</script>

<style>

</style>
