<template>
    <v-blank :blank="false">
        <div class="banner" v-if="user">
            <div class="banner__container">
                <div class="pic"><img :src="user.avatar" /></div>
                <div class="name">{{user.name}}</div>
                <div class="desc">{{user.position}}</div>
            </div>
        </div>
        <div class="show__content" v-if="user">
            <div class="show__title">- 摄影师简介 -</div>
            <div class="show__desc">{{user.content}}</div>
            <!--
            <div class="text-center">
                <a href="javascript:;" class="show__desc__more">查看全部</a>
                <a href="javascript:;" class="show__desc__more up">收起</a>
            </div>-->

            <div class="show__title line">- 摄影作品赏析 -</div>
            <div class="grid-box clearfix">
                <div class="grid-box__item" v-for="(p, index) of user.works">
                    <div class="grid-box__content" @click="togglePopup(p, index)">
                        <div class="grid-box__img" v-lazy:background-image="p.pic + '/b200'"></div>
                    </div>
                </div>
            </div>
            <div class="show__title line">- iPhotos 摄影历程 -</div>
            <div class="experience">
                <div class="expr__item" v-for="p of user.experience">
                    <h5>{{p.title}}</h5>
                    <p>{{p.subtitle}}</p>
                </div>
            </div>
        </div>
        <a href="/apply" class="market__apply__btn">立即预约</a>
        <v-gallery :index="index" :is-waterfall="false" :list="list" type="2" v-model="popupVisible"></v-gallery>

    </v-blank>
</template>
<script>
    import photographers from 'components/photographers'
    import vGallery from 'components/gallery'
    export default{
        data(){
            return {
                index: 0,
                user: null,
                list: [],
                popupVisible: false
            }
        },
        components:{
            vGallery
        },
        created() {
            this.user = photographers[parseInt(this.query.id)]
            if (this.user) {
                let list = []
                for (let work of this.user.works) {
                    list.push({
                        pic: work.pic,
                        pic_width: work.width,
                        pic_height: work.height,
                        content: work.content
                    })
                }

                this.list = list
            }
        },
        mounted() {
            this.$store.commit('SPIN')
        },
        methods: {
            togglePopup(item, index) {
                this.index = index
                this.popupVisible = true
            }
        }
    }
</script>
<style lang="less" scoped>
    .banner {
        padding-top: 45.33%;
        position: relative;
        background: url("../../../../assets/images/market/bg.png") no-repeat center;
        background-size: 100% 100%;
    }
    .banner__container {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .pic {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,0.20);
            margin-bottom: 10px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .name {
            font-size: 17px;
            color: #fff;
            font-weight: bold;
            margin-bottom: 6px;
        }
        .desc {
            font-size: 13px;
            color: #fff;

        }
    }
    .show__content {
        padding: 0 20px;
    }
    .show__title {
        padding: 20px 0;
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-bottom: 0;
        position: relative;
        &.line {
            &:before {
                content: '';
                position: absolute;
                height: 1px;
                background: rgba(0, 0, 0, 0.1);
                transform: scaleY(0.5);
                top: 0;
                left: 0;
                right: 0;
            }
        }
    }
    .show__desc {
        font-size: 15px;
        line-height: 45/30;
        color: #333;
        -webkit-line-clamp: 10;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        margin-bottom: 20px;
    }
    .show__desc__more {
        display: inline-block;
        font-size: 15px;
        color: #00b459;
        text-align: center;
        margin: 20px 0;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            width: 5px;
            height: 4px;
            background: url("../../../../assets/images/market/down.png") no-repeat center;
            background-size: 100% 100%;
            top: 50%;
            margin-top: -2px;
            right: -10px;
        }
        &.up {
            &:after {
                transform: rotate(-180deg);
            }
        }
    }
    .grid-box {
        margin-bottom: 20px;
    }
    .grid-box__img {
        background-color: #eee;
    }
    .experience {
        padding-bottom: 40px;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            left: 5px;
            top: 2px;
            bottom: 0;
            width: 1px;
            background-image: url("../../../../assets/images/market/line.png");
            background-repeat: repeat-y;
            background-size: 100% 100%;
            background-position: center;
            transform: scaleX(0.5);
        }
        .expr__item {
            margin-bottom: 20px;
            padding-left: 20px;
            position: relative;
            &:before {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                left: 0;
                top: 2px;
                background: url("../../../../assets/images/market/point.png") no-repeat center;
                background-size: 100% 100%;
            }
            h5 {
                color: #333;
                font-weight: bold;
                font-size: 15px;
                margin-bottom: 6px;
            }
            p {
                font-size: 12px;
                color: #999;
            }
        }
    }
    .market__apply__btn {
        position: fixed;
        bottom: 0;
        left: 0;
    }
</style>
