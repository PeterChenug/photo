<template>
    <div class="grid-hot clearfix">
        <div class="grid-hot__item" v-for="(item, index) of list" @click="togglePopup(item, index)">
            <div v-if="index<3" class="grid-hot__img" v-lazy:background-image="item.pic + '/w375'"></div>
            <div v-else class="grid-hot__img" v-lazy:background-image="item.pic + '/b200'"></div>
        </div>
        <div class="grid-hot__item">
            <div class="grid-hot__img grid-hot__holder">
                <div v-html="$t('home.hot')"></div>
            </div>
        </div>
        <v-gallery id="swiper-hot" :index="index" :list="list" v-model="popupVisible"></v-gallery>
        <div v-if="list.length <= 0" class="home__blank__container">
            <a href="javascript:;" class="home__blank">
                {{$t('home.coming')}}
            </a>
        </div>
    </div>
</template>
<script>
    import vGallery from 'components/gallery'
    export default{
        data(){
            return{
                list: [],
                index: 0,
                popupVisible: false
            }
        },
        components:{
            vGallery
        },
        created() {
            this.getList()
        },
        methods: {
            //获取热门相册列表
            getList() {
                this.$http.post('photo/list', {
                    meeting_id: this.meeting.id,
                    page: 1,
                    limit: 10,
                    sort_type: 1
                }).then((response) => {
                    if (response.data.err == 0) {
                        this.list = response.data.res.list
                    }
                })
            },
            togglePopup(item, index) {
                this.index = index
                this.popupVisible = true
            }
        }
    }
</script>
