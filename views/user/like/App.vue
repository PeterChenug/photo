<template>
    <v-layout :reverse="true">
        <div v-if="total <= 0" class="search-photo">
            <div class="search-without__holder"></div>
            <p class="search-photo__desc">
                啥都没找到<br/>
            </p>
        </div>
        <div v-infinite-scroll="getList"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
            <v-grid :total="total" :list="list"></v-grid>
        </div>
    </v-layout>
</template>
<script>
    export default{
        data(){
            return {
                page: 1,
                total: 0,
                list: [],
                loading: true
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            //获取相册列表
            getList() {
                let _this = this
                this.loading = true
                this.$http.post('photo/like/list', {
                    meeting_id: this.meeting.id,
                    page: this.page,
                    invitation_id: this.user.id,
                    limit: 15,
                }).then((response) => {
                    if (response.data.err == 0) {
                        let ret = response.data.res
                        for(let el of ret.list) {
                            this.list.push(el)
                        }
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
