<template>
    <v-blank>
        <div class="photographer-box customer">
            <div class="photographer-box__content">
                <div class="pagination">
                    <span>{{caseActiveIndex}}</span>/<span>{{caseList.length}}</span>
                </div>
                <div class="photographer__title">这些客户都选择我们</div>
                <div class="photographer__subtitle">因为专业，所以信任</div>
            </div>
            <div class="swiper">
                <div class="swiper__content">
                    <div class="swiper-container swiper-customer__container">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="p of caseList" :style="{'background-image': 'url('+ p.pic +')'}">
                                <div class="customer__text">
                                    <h5>{{p.title}}</h5>
                                    <p>{{p.subtitle}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div><!--customer-->


        <div class="photographer-box photographer">
            <h5 class="title">iPhotos推荐摄影师</h5>
            <div class="weui-flex" v-for="recommend of recommendList">
                <div class="weui-flex__item" v-for="p of recommend">
                    <div class="avatar">
                        <img :src="p.avatar" />
                    </div>
                    <h5 class="name">{{p.name}}</h5>
                    <p>{{p.position}}</p>
                </div>
            </div>
        </div>

        <a href="/market/photographer/works" class="photographer-banner"></a>

        <div class="photographer-box works">
            <div class="photographer__title">摄影作品赏析</div>
            <div class="photographer__subtitle">好作品，自己会说话</div>
            <div class="photographer-box__content" v-for="(p, index) of list">
                <div class="cell blank">
                    <div class="cell__hd">
                        <img :src="p.avatar" />
                    </div>
                    <div class="cell__bd">
                        <h5>{{p.name}}</h5>
                        <p>{{p.content}}</p>
                    </div>
                    <div class="cell__ft">
                        <a :href="'/market/photographer/show?id=' + index" class="cell__btn">预约TA</a>
                    </div>
                </div>
                <div class="swiper">
                    <div class="swiper__content">
                        <div class="swiper-container swiper-works__container">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide" v-for="work of p.works.slice(0,3)">
                                    <img :src="work.pic" />
                                </div>
                                <div class="swiper-slide">
                                    <a :href="'/market/photographer/show?id=' + index" class="more">
                                        <span>更多TA的作品</span>
                                    </a>
                                </div>
                            </div>
                            <div class="swiper-scrollbar"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div><!--customer-->
    </v-blank>
</template>
<script>
    import Swiper from 'swiper'
    import photographers from 'components/photographers'
    import _ from 'lodash'
    export default{
        data(){
            return {
                caseActiveIndex: 1,
                list: photographers,
                recommendList: [],
                caseList: [{
                    pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/case_1.png',
                    title: '2017宁波Westin 打造最潮Baby秀！',
                    subtitle: 'Westin · 999人关注'
                }, {
                    pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/case_2.png',
                    title: '2017宁波Westin 打造最潮Baby秀！',
                    subtitle: 'Westin · 999人关注'
                }, {
                    pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/case_1.png',
                    title: '2017宁波Westin 打造最潮Baby秀！',
                    subtitle: 'Westin · 999人关注'
                }, {
                    pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/case_2.png',
                    title: '2017宁波Westin 打造最潮Baby秀！',
                    subtitle: 'Westin · 999人关注'
                }, {
                    pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/case_1.png',
                    title: '2017宁波Westin 打造最潮Baby秀！',
                    subtitle: 'Westin · 999人关注'
                }, {
                    pic: 'https://static.idevent.cn/oss/sourcingproject/photographer/case_2.png',
                    title: '2017宁波Westin 打造最潮Baby秀！',
                    subtitle: 'Westin · 999人关注'
                }]
            }
        },
        created() {
            this.recommendList = _.chunk(photographers, 3)
        },
        components:{
        },
        mounted() {
            this.initSwiperCustomer()
            this.initSwiperWorks()
            this.$store.commit('SPIN')

        },
        methods: {
            initSwiperCustomer() {
                let _this = this
                new Swiper('.swiper-customer__container', {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 10,
                    onSlideChangeEnd: function(swiper) {
                        _this.caseActiveIndex = swiper.activeIndex + 1
                    }
                })
            },
            initSwiperWorks() {
                new Swiper('.swiper-works__container', {
                    scrollbar: '.swiper-scrollbar',
                    slidesPerView: 'auto',
                    scrollbarHide: true,
                    centeredSlides: false,
                    scrollbarDraggable: true,
                    spaceBetween: 10,
                    slidesOffsetBefore: 20,
                    slidesOffsetAfter: 20
                })
            }
        }

    }
</script>
<style lang="less" scoped>
    .photographer-box {
        padding: 30px 20px;
        position: relative;
        .photographer-box__content {
            position: relative;
        }
    }
    .photographer__title {
        position: relative;
        font-size: 21px;
        font-weight: bold;
        color: #333;
        margin-bottom: 6px;
    }
    .photographer__subtitle {
        font-size: 12px;
        color: #999;
    }
    .swiper-scrollbar {
        display: none;
    }

    /** customer **/
    .customer {
        padding: 30px 0;
        .pagination {
            position: absolute;
            top: 0;
            right: 20px;
            color: #3F3F3F;
            font-size: 15px;
            span {
                color: #3F3F3F;
                &:first-child {
                    color: #333;
                }
            }

        }

        .photographer-box__content {
            padding: 0 20px;
            margin-bottom: 20px;
        }

        &:after {
            content: '';
            position: absolute;
            height: 1px;
            transform: scaleY(0.5);
            bottom: 0;
            left: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.1);
        }

        .swiper {
            padding-top: 53.33%;
            position: relative;
        }
        .swiper-slide {
            width: 89%;
            background: #eee;
            text-align: center;
            position: relative;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            .customer__text {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 10px;
                background: rgba(0, 0, 0, 0.8);
                text-align: left;
                h5 {
                    font-weight: bold;
                    font-size: 16px;
                    color: #fff;
                    margin: 0 0 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                p {
                    font-size: 12px;
                    line-height: 1;
                    margin: 0;
                    color: #fff;
                    opacity: 0.6;
                }
            }
        }
    }


    /**swiper**/
    .swiper {
        position: relative;
        .swiper__content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .swiper-container {
            width: 100%;
            height: 100%;
            position: relative;
        }
    }

    /**photographer**/
    &.photographer {
        padding: 30px 0;
        text-align: center;
        h5.title {
            font-size: 15px;
            color: #999;
            text-align: center;
            margin: 0 0 20px;
            font-weight: 200;
        }
        .avatar {
            width: 64px;
            height: 64px;
            background: #eee;
            border-radius: 50%;
            overflow: hidden;
            display: inline-block;
            margin-bottom: 10px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .name {
            font-weight: normal;
            color: #333;
            margin-bottom: 6px;
            font-size: 15px;
        }
        p {
            font-size: 12px;
            color: #999;
            line-height: 1;
        }
        .weui-flex {
            margin-top: 15px;
        }

    }
    .photographer-banner {
        display: block;
        width: 100%;
        background: url("../../../assets/images/market/photographer_banner.png") no-repeat center;
        padding-top: 32%;
        background-size: 100% 100%;
    }

    .works {
        padding: 30px 0;
        .photographer__title, .photographer__subtitle {
            padding: 0 20px;
        }
        .photographer-box__content {
            padding: 20px 0 30px;
        }
        .cell {
            margin-bottom: 10px;
            padding: 0 20px;
        }
        .cell__hd {
            background: #eee;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .cell__bd {
            padding: 0 10px;
            overflow: hidden;
            h5 {
                font-size: 15px;
                color: #333;
                font-weight: bold;
                margin-bottom: 6px;
            }
            p {
                color: #999;
                font-size: 12px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

        }

        .cell__ft {
            padding-right: 0;
            &:after {
                display: none;
                height: 0;
            }
        }

        .cell__btn {
            display: inline-block;
            border: 1px solid #00b459;
            color: #00b459;
            font-size: 12px;
            line-height: 1;
            padding: 8px 15px;
        }

        .swiper {
            padding-top: 42.67%;
            position: relative;
        }
        .swiper-slide {
            width: 64%;
            background: #eee;
            text-align: center;
            position: relative;
            img {
                max-width: 100%;
            }
            .more {
                display: flex;
                align-items: center;
                justify-content: center;
                background-image: linear-gradient(-155deg, rgba(0,207,88,0.04) 0%, rgba(0,195,169,0.04) 100%);
                width: 100%;
                height: 100%;
                background-color: #fff;
                span {
                    color: #00B459;
                    font-size: 15px;
                    display: inline-block;
                    position: relative;
                    &:after {
                        content: '';
                        position: absolute;
                        background: url("../../../assets/images/market/down.png") no-repeat right center;
                        background-size: 5px 4px;
                        right: -10px;
                        top: 50%;
                        width: 5px;
                        transform: rotate(-90deg);
                        height: 4px;
                        margin-top: -2px;
                    }
                }
            }
        }
    }
</style>
