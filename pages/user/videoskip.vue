<template lang="pug">
    v-content()
        p ビデオスキップとは？<br>YOUTUBEの動画に再生マーカーを追加できます。
        template(v-if="videoId")
            youtube#video(:video-id="videoId" ref="youtube" :player-vars="playerVars")
            v-toolbar(dense)
                v-btn-toggle
                    v-btn(flat @click="addMaker"): v-icon add
                v-divider(vertical)
                v-btn-toggle#horizonMaker(v-if="doneMaker")
                    #mask(v-model="doneMaker")
                        draggable#area(v-model='doneMaker')
                            div.btn(v-for="ele,key,i in doneMaker"): v-btn(@click="seek(ele.msec)") {{ele.label}}
        v-container
            v-layout
                v-flex: v-text-field(label="YOUTUBE ID" v-model="videoSearchCurrentId")
                v-flex: v-btn(fab dark small color="indigo" @click="add" v-if="videoSearchCurrentId")
                    v-icon add
            v-card(fluid)
                v-toolbar(style="position: relative") ビデオリスト
                v-list(avatar)
                    template(v-for="list,key,index in lists")
                        v-list-tile(@click="setVideoID(key)")
                            v-list-tile-avatar: img(:src="list.thumbnail")
                            v-list-tile-content
                                v-list-tile-title {{ list.title }}
                            v-list-tile-action
                                v-icon(fab color="grey lighten-1" @click="del(key)") delete
                        v-container(v-if="videoId == key") 
                            template(v-for="ele,k,i in doneMaker")
                                v-list-tile
                                    v-list-tile-content  {{ele.label}}
                                    v-list-tile-action
                                        v-icon(fab color="grey lighten-1" @click="MakerDel(key,ele.key)") delete
                                v-divider(v-if="i + 1 < Object.keys(doneMaker).length")
                        v-divider(v-if="index + 1 < Object.keys(lists).length")
</template>

<script>
import draggable from "vuedraggable";
import Vue from "vue";
import VueYoutube from "vue-youtube";
Vue.use(VueYoutube);
export default {
    components: {
        draggable
    },
    data(){
        return{
            user:this.$store.state.user,
            videoSearchCurrentId:"M7lc1UVf-VE",
            currentVideoMaker:"",
            playerVars: {
                playsinline: 1,
            },
            videoId:"",
            lists:[],
        }
    },
    computed: {
        player() {
            return this.$refs.youtube.player;
        },
        doneMaker(){
            // let m = Object.values(this.currentVideoMaker)
            if(this.currentVideoMaker == null) return　false
            let m = Object.entries(this.currentVideoMaker).map(([key, msec]) => ({key,msec}));
            let r = {}
            // console.log(m)

            var s = m.slice(0);
            s.sort(function(a,b) {
                return a.msec - b.msec;
            });
            s.map((val,i)=>{
                val["label"] = this.convertTime(val.msec.toFixed(0))
            })
            return s
        }
    },
    mounted(){
        this.listen()
    },
    methods:{
        listen () {
            console.log("listen")
            let ref = `users/${this.user.uid}/videos/`
            this.$firebase.database().ref(ref).on('value', snapshot => {
                if (snapshot) {
                    const rootList = snapshot.val()
                    this.lists = rootList
                }
            })
        },
        MakerDel(key,skey){
            if(window.confirm("削除します")){
                let ref = `users/${this.user.uid}/videos/${key}/maker`
                this.$firebase.database().ref(ref).child(skey).remove()
            }
        },
        del(key){
            if(window.confirm("削除します")){
                let ref = `users/${this.user.uid}/videos/${key}`
                this.$firebase.database().ref(ref).remove()
            }
        },
        addMaker(){
            this.player.pauseVideo();
            let newCT = {...this.currentVideoMaker}
            this.player.getCurrentTime().then(time => {
                if(time == 0 ) return false
                this.player.playVideo();
                let id = this.videoId;
                
                let ref = `/users/${this.user.uid}/videos/${id}/maker/`
                var newPostKey = this.$firebase.database().ref(ref).push().key;
                this.$firebase.database().ref(ref+newPostKey).set(time);
                newCT[newPostKey] = time
                this.currentVideoMaker = newCT
            });
        },
        add(){
            let id = this.videoSearchCurrentId;
            let p = new Promise((resolve, reject) => {
                let data = this.$axios.$get('https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=AIzaSyDYQnUMeikUltGwnZ5ACidhznQldMZtJzk&fields=items(snippet(title,thumbnails))&part=snippet');
                resolve(data);
                this.setVideoID(id)
            })
            p.then(v=>{
                let snippet = v.items[0].snippet
                let item = {
                    "date": Date.now(),
                    "id": id,
                    "title": snippet.title,
                    "thumbnail": snippet.thumbnails.default.url,
                }
                var updates = {};
                updates['/users/' + this.user.uid + '/videos/' + id] = item;
                this.$firebase.database().ref().update(updates);
            })
        },
        setVideoID(key){
            // console.log("setVideoID" , key)
            this.videoId = key
            let ref = `users/${this.user.uid}/videos/${key}/maker/`
            this.$firebase.database().ref(ref).on('value', snapshot => {
                if (snapshot) {
                    // console.log("setVideoID" ,snapshot.val())
                    this.currentVideoMaker = snapshot.val()
                }
            })
        },
        convertTime(time) {
            time = Math.round(time);
            let minutes = Math.floor(time / 60);
            let seconds = time - minutes * 60;

            seconds = seconds < 10 ? "0" + seconds : seconds;
            minutes = minutes < 10 ? "0" + minutes : minutes;

            // console.log(minutes + ":" + seconds);
            return minutes + ":" + seconds
        },
        seek(sec){
            this.player.seekTo(sec);
            this.firebaseAddNow(sec)
        },
        firebaseAddNow(sec){
            let id = this.videoSearchCurrentId;
            let ref = `/users/${this.user.uid}/videos/${id}/nowMaker`
            this.$firebase.database().ref(ref).set(sec);
        }
    },

}
</script>
<style>
#video{
    width: 100% !important;
    height: auto !important;
}
</style>
<style scoped>

#horizonMaker{
    overflow: hidden;
}
#mask{
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;  /* 慣性スクロール */
}
#horizonMaker #area{
    margin: 0;
    padding: 0;
    display: inline-table;
    max-width: 100%;
}
#horizonMaker .btn{
    display: table-cell;
}
</style>
