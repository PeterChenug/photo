<template>
    <v-layout>
        <div class="album-detail" v-if="current">
            <div class="album__content__title">
                {{lang=='zh' ? current.title : current.title_en}}
            </div>
            <div class="album__content__subtitle" v-if="current.subtitle || current.subtitle_en">
                {{lang=='zh' ? current.subtitle : current.subtitle_en}}
            </div>
            <div class="album-detail__count">
                共{{current.photo_count}}张
            </div>
        </div>
        <div v-infinite-scroll="getList"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
            <v-grid :total="total" :list="list"></v-grid>
        </div>
        <v-bar slot="bar" current="album"></v-bar>
    </v-layout>
</template>
<script>
    export default{
        data(){
            return {
                current: null,
                page: 1,
                total: 0,
                loading: true,
                list: []
            }
        },
        components:{
        },
        mounted() {
            this.getAlbum()
        },
        methods: {
            //获取详情
            getAlbum() {
                this.$http.post('photo/album', {
                    id: this.query.album_id
                }).then((response) => {
                    if(response.data.err == 0) {
                        this.current = response.data.res
                        this.getList()
                    }
                })
            },
            //获取相册列表
            getList() {
                let _this = this
                this.loading = true
                this.$http.post('photo/list', {
                    meeting_id: this.meeting.id,
                    page: this.page,
                    limit: 15,
                    album_id: this.query.album_id
                }).then((response) => {
                    if (response.data.err == 0) {
                        let ret = response.data.res
                        for(let el of ret.list) {
                            this.list.push(el)
                        }
                        console.log(this.list.length)
                        this.total = ret.total
                        this.page = parseInt(this.page) + 1
                        this.$nextTick(() => {
                            if(_this.total > _this.list.length) {
                                _this.loading = false
                            }
                        })
                    }
                }).then(() => {
                    this.$store.commit('SPIN')
                })
            }
        }

    }
</script>
