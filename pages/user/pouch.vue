<template lang="pug">
    v-content
        p ポーチの中身とは？<br>化粧ポーチの中身を保存します。
        v-container
            v-card
                v-toolbar(style="position: relative") ポーチの中身
                v-container
                    template
                        v-list-tile(@click="setCurrent('add')")
                            v-list-tile-content
                                v-btn(block) ポーチに追加
                        v-container(v-if="current=='add'") 
                            v-form(ref="form" lazy-validation)
                                input(type="file" multipule accept="image/*" @change="addSelectFiles" id="choice" style="display:none")
                                v-avatar(color="grey lighten-1" size="80" v-if="!form.isImgData")
                                    label(for="choice" style="width:80px;height:80px")
                                        v-icon(dark) camera_alt
                                img(v-else :src="form.imageData" style="width:100%")
                                v-text-field(:rules="[v => !!v || 'Item is required']" required label="登録名" v-model="form.productName")
                                v-text-field(:rules="[v => !!v || 'Item is required']" required label="ジャンル" v-model="form.genreName")
                                v-text-field(required label="購入日" v-model="form.buyData")
                                v-text-field(required label="期限" v-model="form.expiraData")
                                v-btn(@click="submit") 保存
                v-list(avatar three-line)
                    template(v-for="list,key,index in lists")
                        v-list-tile(@click="setCurrent(key)")
                            v-list-tile-avatar(color="blue-grey lighten-4")
                                template(v-if="list.thumbnail")
                                    img(:src="list.thumbnail")
                                template(v-else)
                                    input(type="file" accept="image/*" @change="selectFiles" id="choice" style="display:none")
                                    label#avatarLabel(for="choice"): v-icon(dark) camera_alt
                            v-list-tile-content
                                v-list-tile-title {{ list.productName }}
                                v-list-tile-sub-title {{ list.genreName }} <br> 購入：{{ list.buyData }}
                            v-list-tile-action
                                v-icon(fab color="grey lighten-1" @click="del(key)") delete
</template>

<script>
export default {
    data(){
        return{
            user:this.$store.state.user,
            lists:[],
            current:"",
            form:{
                isImgData:false,
                imageData:"",
                productName:"",
                genreName:"",
                buyData:"",
                expiraData:""
            },
        }
    },
    mounted(){
        this.listen()
    },
    methods:{
        listen () {
            // console.log("listen")
            let ref = `users/${this.user.uid}/pouchData/`
            this.$firebase.database().ref(ref).on('value', snapshot => {
                if (snapshot) {
                    // console.log(snapshot.val())
                    this.lists = snapshot.val()
                }
            })
        },
        setCurrent(key){
            this.current = key
            let current = this.lists[key]
            if(key!=="add"){
                this.form = {
                    isImgData:false,
                    imageData:current.imageData,
                    productName: current.productName,
                    genreName: current.genreName,
                    buyData: current.buyData,
                    expiraData: current.expiraData
                }
            }else{
                this.form = {
                    isImgData:false,
                    imageData:"",
                    productName:"",
                    genreName:"",
                    buyData:"",
                    expiraData:""
                }
            }
        },
        add(){},
        addSelectFiles(e){
            const files = e.target.files
            let url = URL.createObjectURL(files[0])
            this.form.imageData = url
            this.form.isImgData = true
            // console.log(url)
        },
        del(key){
            // console.log(key)
            let ref = `/users/${this.user.uid}/pouchData/${key}`
            this.$firebase.database().ref(ref).remove()
        },
        selectFiles(e){
            const files = e.target.files
            this.putFirebaseStorage(files[0])
            // console.log(e)
        },
        submit(){
            if (this.$refs.form.validate()) {
                let ref = `/users/${this.user.uid}/pouchData/`
                this.$firebase.database().ref(ref).push(this.form);
            }
        },
        putFirebaseStorage(file){
            // console.log(file.name)
            let user = this.$firebase.auth().currentUser;
            let store = this.$store
            var storage = this.$firebase.storage()
            var storageRef = storage.ref()
            var ref = storageRef.child(`user/${user.uid}/pouch/${file.name}`)
            // var desertRef = (user.photoURL) ? storage.refFromURL(user.photoURL) : false;

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
                    let ref = `/users/${this.user.uid}/pouchData/`
                    this.$firebase.database().ref(ref).push(this.form);
                })
            });


        }
    }
}
</script>

<style scoped>
#avatarLabel{
    width:50px;
    height:50px;
}
</style>
