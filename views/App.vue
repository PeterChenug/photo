<template>
    <v-layout>
        <div v-if="!isWechat && tip" class="banner-holder__tip" @click="toggleTipClose">
                <div class="banner-holder__tip__content" @click="toggleTip">
                若要体验完整版功能，请点这里→<a href="javascript:;">查看详情</a>
            </div>
        </div>
        <div class="banner-holder" v-lazy:background-image="banner"></div>
        <div class="bar bar-menu clearfix">
            <ul class="bar__item pull-left clearfix">
                <li :class="{'active': sort_type==0}">
                    <a href="javascript:;" @click="toggleType(0)">{{$t("home.bar_all")}}</a>
                </li>
                <li :class="{'active': sort_type==1}" v-if="list.length > 10">
                    <a href="javascript:;" @click="toggleType(1)">{{$t("home.bar_hot")}}</a>
                </li>
            </ul>
            <ul class="bar__item clearfix pull-right">
                <li class="mode_en" @click="toggleEnModeChange">
                    <a href="javascript:;">{{mode_en ? '中文' : 'EN'}}</a>
                </li>
                <li class="mode_night" @click="toggleNightMode"></li>
            </ul>
        </div>
        <div class="home-grid__all" v-show="sort_type==0" v-infinite-scroll="getList"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
            <v-grid :total="total" :list="list"></v-grid>
            <div v-if="list.length <= 0" class="home__blank__container">
                <a href="javascript:;" class="home__blank">
                    {{$t('home.coming')}}
                </a>
            </div>
        </div>
        <div class="home-grid__hot" v-show="sort_type==1" :class="{'active': sort_type==1}">
            <v-hot></v-hot>
        </div>
        <a v-if="isPrint" :href="url('/user/buy')" class="home-print__fixed" :class="{'active': print}"></a>
        <v-bar slot="bar" current="home"></v-bar>
    </v-layout>
</template>
<script>
    import vHot from './Hot.vue'
    import weui from 'weui.js'
    import QRCode from 'qrcode'
    export default{
        data(){
            return {
                mode_night: false,
                mode_en: false,
                locker: false,
                loading: true,//more
                sort_type: 0,
                page: 1,
                total: 0,
                list: [],
                qrcode: '',
                dialog: null
            }
        },
        created() {
            if (this.night) {
                this.mode_night = true
            }
            if (this.lang == 'en') {
                this.mode_en = true
            }

            //生成二维码
            let _this = this
            QRCode.toDataURL(location.origin + '/photos/?mid=' + this.meeting.id, {
                margin: 1,
                scale: 7
            }, function(err, url) {
                _this.qrcode = url
            })
        },
        watch: {
            mode_night() {
                this.$store.commit('NIGHT', this.mode_night)
            }
        },

        computed: {
            banner() {
                if(this.meeting.settings && this.meeting.settings.iphoto && this.meeting.settings.iphoto.homepage_banner) {
                    return this.meeting.settings.iphoto.homepage_banner
                } else {
                    return ''
                }
            },
            night() {
                return this.$store.state.night
            },
            lang() {
                return this.$store.state.lang
            },
            print() {
                return this.$store.state.print
            },
            tip() {
                return this.$store.state.tip
            }
        },
        mounted() {
            this.getList()
            this.getCounts()
        },
        components:{
            vHot
        },
        methods: {
            //切换热门／全部
            toggleType(type) {
                this.sort_type = type
            },
            //切换夜间模式
            toggleNightMode() {
                this.mode_night = !this.mode_night
                this.$store.commit('NIGHT', this.mode_night)
            },
            //切换语言模式
            toggleEnModeChange() {
               if (this.mode_en) {
                    this.$store.commit('LANG', 'zh')
                } else {
                    this.$store.commit('LANG', 'en')
                }
                window.location.reload()
            },
            //获取相册列表
            getList() {
                let _this = this
                if (this.sort_type == 1) {
                    return
                }
                this.loading = true
                this.$http.post('photo/list', {
                    meeting_id: this.meeting.id,
                    page: this.page,
                    limit: 15,
                    sort_type: 0
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
            },
            //获取打印购物车数量
            getCounts() {
                this.$http.post('photo/counts', {
                    invitation_id: this.user.id
                }).then((response) => {
                    if (response.data.err == 0 && response.data.res.printCart > 0) {
                        this.$store.commit('PRINT')
                    }
                })
            },
            //执行弹窗
            toggleTip() {
                let html = '<div class="banner-holder__alert"><img src="' + this.qrcode + '" /><p>' + this.$t('home.tip_alert') + '</p></div>'
                let _this = this
                let dialog = weui.dialog({
                    content: html,
                    className: 'photo-dialog-close',
                    buttons: [{
                        label: '',
                        type: 'default',
                        onClick: function(){
                            dialog.hide()
                        }
                    }]
                });
                event.preventDefault()
                event.stopPropagation()
            },
            toggleTipClose() {
                this.$store.commit('TIP', false)
            }
        }
    }
</script>
