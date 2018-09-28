<template lang="pug">
    v-container
        v-alert(type="warning" :value="!user.emailVerified")
            | メールアドレスの確認が取れていません。登録アドレスに送信されたメールから認証の承認をしてください。
            v-btn(@click="sendEmailVerification") 認証メールの再送信
        v-avatar(size="100" color="blue-grey lighten-4" style="margin:auto;display: block;")
            template(v-if="user.photoURL")
                input(type="file" multipule accept="image/*" @change="selectFiles" id="choice" style="display:none" )
                label#avatarLabel(for="choice")
                    img(:src="user.photoURL" v-if="!imageData")
                    img(:src="imageData" v-else)
            template(v-if="!user.photoURL && !imageData" )
                input(type="file" multipule accept="image/*" @change="selectFiles" id="choice" style="display:none")
                label#avatarLabel(for="choice"): v-icon(size="60" dark) camera_alt
            template(v-if="!user.photoURL && imageData" )
                img(:src="imageData")
        v-form
            v-text-field(label="Display Name" v-model="user.displayName")
            v-text-field(required label="Mail Address" v-model="user.email")
        v-btn(@click="updatePassword") パスワード変更メールを送る
</template>

<script>
export default {
  data(){
    return{
      user: this.$store.state.user,
      imageData:"",
    }
  },
  methods:{
    selectFiles(e){
      const files = e.target.files
      let url = URL.createObjectURL(files[0])
      this.imageData = url
      this.putFirebaseStorage(files[0])
    },
    sendEmailVerification(){
        var user = this.$firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
        // Email sent.
        }).catch(function(error) {
        // An error happened.
        });    
    },
    updatePassword(){
        var auth = this.$firebase.auth();
        var emailAddress = this.user.email;

        auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
        }).catch(function(error) {
        // An error happened.
        });
    },
    putFirebaseStorage(file){
        console.log(this.user.photoURL)
        let user = this.$firebase.auth().currentUser;
        let store = this.$store
        var storage = this.$firebase.storage()
        var storageRef = storage.ref()
        var ref = storageRef.child(`user/${user.uid}/profile/${file.name}`)
        var desertRef = (user.photoURL) ? storage.refFromURL(user.photoURL) : false;

        var uploadTask = ref.put(file)

        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function (error) {
            console.log('file upload Error');
        }, function () {
            console.log('完了');
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log(downloadURL);
				var userdata = {
					uid: user.uid,
					displayName: user.displayName,
					email: user.email,
					emailVerified: user.emailVerified,
					photoURL: downloadURL
				}
                store.commit('setUser',userdata)
                // ユーザープロフィールの変更
                user.updateProfile(userdata).then(function () {
                    console.log('更新しました。');
                    console.log(store.state.user);
                    if (desertRef) {
                        desertRef.delete().then(function () {
                            console.log('削除成功');
                        }).catch(function (error) {
                            console.log('削除失敗');
                        });
                    }
                }).catch(function (error) {
                    //失敗
                    alert('失敗しました');
                });

            })
        });


    }
  }
}
</script>

<style scoped>
#avatarLabel{
    width:100px;
    height:100px;
}
</style>
