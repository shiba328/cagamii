<template lang="pug">
    v-content
        p ビデオスキップとは？<br>YOUTUBEの動画に再生マーカーを追加できます。
        template(v-if="videoId")
            youtube(:video-id="videoId" ref="youtube")
            v-btn() マーカー追加
            #horizonMaker(v-if="doneMaker")
                #mask: ul
                    li(v-for="ele,key,i in doneMaker"): v-btn( @click="seek(ele)") {{ele}}
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
                        v-divider(v-if="index + 1 < Object.keys(lists).length")
</template>

<script>
import Vue from "vue";
import VueYoutube from "vue-youtube";
Vue.use(VueYoutube);
export default {
    data(){
        return{
            user:this.$store.state.user,
            videoSearchCurrentId:"M7lc1UVf-VE",
            currentVideoMaker:"",
            videoId:"",
            lists:[],
        }
    },
    computed: {
        player() {
            return this.$refs.youtube.player;
        },
        doneMaker(){
            let m = this.currentVideoMaker
            let r = {}
            Object.keys(m).map((val,key)=>{
                r[val] = this.convertTime(m[val].toFixed(0))
            })
            // console.log(r)
            return r
        }
    },
    mounted(){
        this.listen()
    },
    methods:{
        listen () {
            let ref = `users/${this.user.uid}/videos/`
            this.$firebase.database().ref(ref).on('value', snapshot => {
                if (snapshot) {
                    const rootList = snapshot.val()
                    this.lists = rootList
                    // console.log(rootList)
                }
            })
        },
        del(key){
            alert(key)
            if(window.confirm("削除します")){
                let ref = `users/${this.user.uid}/videos/${key}`
                this.$firebase.database().ref(ref).remove()
            }
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
                    "maker": [1.0]
                }
                var updates = {};
                updates['/users/' + this.user.uid + '/videos/' + id] = item;
                this.$firebase.database().ref().update(updates);
            })
        },
        setVideoID(key){
            this.videoId = key
            this.currentVideoMaker = this.lists[key]["maker"]
        },
        convertTime(time) {
            time = Math.round(time);
            let minutes = Math.floor(time / 60);
            let seconds = time - minutes * 60;

            seconds = seconds < 10 ? "0" + seconds : seconds;
            minutes = minutes < 10 ? "0" + minutes : minutes;

            console.log(minutes + ":" + seconds);
            return minutes + ":" + seconds
        },
        seek(sec){
            console.log(sec)
        }
    },

}
</script>

<style scoped>
#horizonMaker{
    overflow: hidden;
}
#mask{
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;  /* 慣性スクロール */
}
#horizonMaker ul{
    margin: 0;
    padding: 0;
  display: inline-table;
  max-width: 100%;
}
#horizonMaker li{
    display: table-cell;
}
</style>
