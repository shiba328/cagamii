<template lang="pug">
    v-content
        p あたり線とは？<br>Cagamii専用アプリを起動すると、登録されたあたり線が表示されます。
        v-container
            v-card
                v-toolbar(style="position: relative") あたり線
                    v-spacer
                    v-btn(absolute bottom right fab dark small color="indigo" @click="addSegment")
                        v-icon add
                v-card-text
                    v-list(two-line)
                        template(v-for="(line, index) in lines" v-if="listen")
                            v-list-tile( avatar :key="line.date")
                                v-list-tile-avatar {{ index + 1 }} SEG
                                v-list-tile-content
                                    v-list-tile-title ATARI {{ index + 1 }}
                                    v-list-tile-sub-title  {{ line.date }}
                                v-list-tile-action
                                    v-icon(fab color="grey lighten-1" @click="del(line.key)") delete
                            v-divider
                            v-list(style="position: relative")
                                template(v-for="(l, key, ind) in line.line")
                                    v-layout(align-center :key="key")
                                        v-flex.text-xs-center
                                            .display-1 {{ind+1}} 
                                            .headline Line
                                            v-select(solo :items="plant" v-model="l.plant")
                                        v-flex                  
                                            v-layout(v-for="(p, i) in l.points" :key="i")
                                                v-flex(v-if="i == 0") 始点
                                                v-flex(v-else-if="i == (Object.keys(l.points).length - 1)") 終点
                                                v-flex(v-else) {{i}}点
                                                v-flex: v-text-field(type="number" label="X" :value="p.x")
                                                v-flex: v-text-field(type="number" label="Y" :value="p.y") 
                                        v-flex
                                            v-icon(fab color="grey lighten-1" @click="del(line.key+'/line/'+key)") delete
                                    v-divider
                                v-btn(absolute bottom right fab small )
                                    v-icon(color="grey lighten-1" @click="addLine(line.key)") add
                            v-divider(v-if="index + 1 < lines.length")
</template>

<script>
export default {
    data(){
        return{
            user:this.$store.state.user,
            lines:{},
            plant:["水平","垂直","斜め"]
        }
    },

    mounted(){
        this.listen()
    },
    methods:{
        listen () {
            let ref = `users/${this.user.uid}/lines/`
            this.$firebase.database().ref(ref).on('value', snapshot => {
                if (snapshot) {
                const rootList = snapshot.val()
                let list = []
                Object.keys(rootList).forEach((val, key) => {
                    rootList[val]["toggle"] = true
                    rootList[val]["key"] = val
                    list.push(rootList[val])
                })
                // console.log(list)
                this.lines = list
                }
            })
        },
        addSegment(){
            var newKey1 = this.$firebase.database().ref().child(`users/${this.user.uid}/lines/`).push().key;
            var newKey2 = this.$firebase.database().ref().child(`users/${this.user.uid}/lines/${newKey1}`).push().key;
            let child = `users/${this.user.uid}/lines/${newKey1}/`
            let item = {
                "date":Date.now(),
                "line":{}
            }
            item["line"][newKey2] = {
                "plant":"水平",
                "points":[{x:"0",y:"50"},{x:"100",y:"50"}],
                "date":Date.now(),
            }
            // console.log(item)
            this.$firebase.database().ref().child(child).set(item)
        },
        addLine(key){
            let ref = `users/${this.user.uid}/lines/${key}`
            let line = {
                "plant":"水平",
                "points":[{x:"0",y:"50"},{x:"100",y:"50"}],
                "date":Date.now(),
            }
            this.$firebase.database().ref(ref).child("line").push(line)
        },
        del(key){
            if(window.confirm("削除します")){
                let ref = `users/${this.user.uid}/lines/${key}`
                console.log(ref)
                this.$firebase.database().ref(ref).remove()
            }
        }
    }
}
</script>

<style>

</style>
