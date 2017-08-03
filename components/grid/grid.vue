<template>
    <div>
        <div class="grid-box clearfix" v-show="list.length > 0">
            <div v-for="(item, index) of list" class="grid-box__item">
                <div class="grid-box__content" @click="togglePopup(item, index)">
                    <div class="grid-box__img" v-lazy:background-image="item.pic + '/b200'"></div>
                    <div class="grid-box__shadow"></div>
                    <a href="javascript:;" class="grid-box__like" :class="{'selected': item.is_liked == 1}" v-if="item.like_count > 0">{{item.like_count}}</a>
                </div>
            </div>
        </div>
        <div v-if="total > 0 && list.length >= total" class="grid-box__bottom clearfix">
            {{$t('home.end')}}
        </div>
        <!--popup-->
        <v-gallery :index="index" :list="list" v-model="popupVisible"></v-gallery>
    </div>
</template>
<script>
    import vGallery from 'components/gallery'
    export default{
        props: {
            list: {
                type: Array,
                default: []
            },
            total: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                popupVisible: false,
                index: 0,
                width: window.innerWidth/2
            }
        },
        components:{
            vGallery
        },
        methods: {
            togglePopup(item, index) {
                this.index = index
                this.popupVisible = true
            }
        }
    }
</script>
