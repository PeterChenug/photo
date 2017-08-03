<template>
    <v-layout>
        <div v-for="item of list" class="album-list">
            <h5 class="title" v-if="item.name">{{item.name}}</h5>
            <a v-for="p of item.list" :href="url('/album/detail?album_id=' + p.id)" v-lazy:background-image="p.cover" class="album">
                <div class="album__count">{{p.photo_count}}</div>
                <div class="album__content">
                    <h3 class="album__content__title">{{lang=='zh' ? p.title : p.title_en}}</h3>
                    <h5 class="album__content__subtitle">{{lang=='zh' ? p.subtitle : p.subtitle_en}}</h5>
                </div>
            </a>
        </div>
        <v-bar slot="bar" current="album"></v-bar>
    </v-layout>
</template>
<script>
    export default{
        data(){
            return{
                list: []
            }
        },
        components: {

        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                this.$http.post('photo/album/list', {
                    meeting_id: this.meeting.id,
                    page: 1,
                    limit: 30
                }).then((response) => {
                    if (response.data.err == 0 && response.data.res.total > 0) {
                        let res = {}
                        for(let el of response.data.res.list) {
                            if (!res[el.group]) {
                                res[el.group] = {}
                                res[el.group]['name'] = el.group
                                res[el.group]['list'] = []
                            }
                            res[el.group]['list'].push(el)
                        }
                        this.list = Object.values(res)
                        console.log(this.list)
                    }

                }).then((response) => {
                    this.$store.commit('SPIN')
                })
            }
        }
    }
</script>
