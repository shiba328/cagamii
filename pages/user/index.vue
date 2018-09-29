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
        v-btn(@click="getGps") 天気予報をセット
        div 
            div: img(:src="weather.icon")
            div 湿度:{{weather.humidity}}%
            div 気温:{{weather.temp}}°
            div 最高気温：{{weather.temp_max}}°
            div 最低気温：{{weather.temp_min}}°
</template>

<script>
export default {
  data(){
    return{
      user: this.$store.state.user,
      imageData:"",
      account:"",
      weather:"",
    }
  },
  mounted(){
      this.listen()
  },
  methods:{
    getWeather(){
        const API_KEY = "5813987565480d2e852d996eb4b4ea18";
        const url = "https://api.openweathermap.org/data/2.5/find";
        // const city = this.account.city;
        const location = this.account.location;
        const lat = location.split(',')[0]
        const lon = location.split(',')[1]
        const icon_url = "http://openweathermap.org/img/w/";
        let p = new Promise((resolve, reject) => {
            let data = this.$axios.$get(`${url}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
            resolve(data);
        })
        p.then(v=>{
            const today = v.list[0]
            console.log(today)
            this.weather = {
                'humidity': today.main.humidity,
                'temp': today.main.temp,
                'temp_max': today.main.temp_max,
                'temp_min': today.main.temp_min,
                'icon': icon_url + today.weather[0].icon + '.png',
                'description': today.weather[0].temp_min,
            }
        })
        return p.catch(v=>{
            alert("エラーが発生しました。再設定してください。(Weather)")
        })
    },
    listen () {
        let ref = `users/${this.user.uid}/account/`
        this.$firebase.database().ref(ref).on('value', snapshot => {
            if (snapshot) {
                this.account = snapshot.val()
                this.getWeather()
            }
        })
    },
    getGps(){
        navigator.geolocation.getCurrentPosition(location=>{
            this.getGpsCity(location)
        })
    },
    getGpsCity(location){
        const lat = location.coords.latitude
        const lng = location.coords.longitude
        const apikey = "AIzaSyC1m5I3MdJMYR2uCBvvVJCzFLZAYDgEPXg";
        const geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
        let p = new Promise((resolve, reject) => {
            let data = this.$axios.$get(`${geoUrl}${lat},${lng}&language=en&key=${apikey}`)
            resolve(data);
        })
        return p.then(v=>{
            console.log(v)
            var locality = v.results[0].address_components.filter(function(component) {
                return component.types.indexOf("locality") > -1;
            });
            var city = v.results[0].address_components.filter(function(component) {
                return component.types.indexOf("administrative_area_level_1") > -1;
            });
    
            let ref = `users/${this.user.uid}/account/`
            var updates = {};
            updates[ref + "locality"] = locality[0].long_name
            updates[ref + "city"] = city[0].long_name
            updates[ref + "location"] =`${lat},${lng}`;

            this.$firebase.database().ref().update(updates);
            // this.$firebase.database().ref(ref).child("city").set()
        })
        p.catch(v=>{
            alert("エラーが発生しました。再設定してください。(geocode)")
        })
    },
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
