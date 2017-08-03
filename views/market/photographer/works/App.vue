<template>
    <v-blank>
        <div class="works">
            <div class="weui-flex" v-for="item of chunkList">
                <div class="weui-flex__item" v-for="p of item">
                    <div class="works-box" v-lazy:background-image="p.cover + '/w375'" @click="togglePopup(p)">
                        <div class="shadow"></div>
                        <div class="num">共{{p.items.length}}张</div>
                    </div>
                </div>
                <div class="weui-flex__item" v-if="item.length==1"></div>
            </div>
        </div>
        <v-gallery :index="index" :is-waterfall="false" :list="galleryList" type="2" v-model="popupVisible"></v-gallery>
    </v-blank>
</template>
<script>
    import _ from 'lodash'
    import vGallery from 'components/gallery'
    export default{
        data(){
            return{
                list: [{
                    cover: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed38798576.png',
                    items: [{
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed38798576.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed359407fb.png',
                        pic_width: 960,
                        pic_height:640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed3564f302.png',
                        pic_width: 960,
                        pic_height:640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed373cf5d4.png',
                        pic_width: 960,
                        pic_height:640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed38e03828.png',
                        pic_width: 960,
                        pic_height:640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed37b95845.png',
                        pic_width: 960,
                        pic_height:640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/ice/597ed36bdb5c0.png',
                        pic_width: 960,
                        pic_height:640
                    }]
                }, {
                    cover: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed3d312f3a.png',
                    items: [{
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed3d312f3a.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed3de5063b.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed3e3836f0.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed3ebacf89.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed3f8205d1.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed3f159228.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed40d5258f.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/like/597ed407aa8f5.png',
                        pic_width: 960,
                        pic_height: 640
                    }],
                }, {
                    cover: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3a52f9c1.png',
                    items: [{
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3a52f9c1.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3ab6f54f.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3b20c5ee.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3b778c07.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3be120b0.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3c9c7249.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed3c35be30.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed39edc762.png',
                        pic_width: 960,
                        pic_height: 640
                    }, {
                        pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/kevin/597ed39716c34.png',
                        pic_width: 960,
                        pic_height: 640
                    }]
                }],
                index: 0,
                popupVisible: false,
                chunkList: [],
                galleryList: []
            }
        },
        components:{
            vGallery
        },
        created() {
            this.chunkList = _.chunk(this.list, 2)
        },
        mounted() {
            this.$store.commit('SPIN')
        },
        methods: {
            togglePopup(p) {
                this.index = 0
                this.galleryList = p.items
                this.popupVisible = true
            }
        }
    }
</script>
<style lang="less" scoped>
    .works {
        padding: 5px;
    }
    .weui-flex__item {
        padding: 5px;
    }

    .works-box {
        padding-top: 66.67%;
        background: #eee;
        position: relative;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        .shadow {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding-top: 17.39%;
            z-index: 1;
            opacity: 0.7;
            background-image: linear-gradient(-180deg, rgba(0,0,0,0.00) 0%, #000000 100%);
        }
        .num {
            position: absolute;
            right: 5px;
            bottom: 5px;
            z-index: 2;
            font-size: 10px;
            color: #fff;
            opacity: 0.6;
        }
    }
</style>
