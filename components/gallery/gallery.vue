<template>
    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <div :id="id" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Background of PhotoSwipe.
             It's a separate element as animating opacity is faster than rgba(). -->
        <div class="pswp__bg"></div>

        <a href="javascript:;" class="popup-gallery_tips" v-if="type==1">{{$t('gallery.tip')}}</a>
        <a href="javascript:;" class="popup-gallery__btn__close" @click="toggleClose">+</a>
        <!-- Slides wrapper with overflow:hidden. -->
        <div class="pswp__scroll-wrap">

            <!-- Container that holds slides.
                PhotoSwipe keeps only 3 of them in the DOM to save memory.
                Don't modify these 3 pswp__item elements, data is added later on. -->
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>



            <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
            <div class="pswp__ui pswp__ui--hidden">

                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div>
                </div>

                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>

            </div>

        </div>
        <div class="popup-gallery__btn" v-if="type==1 && current">
            <a href="javascript:;" @click="addZan" class="popup-gallery__btn__like"
               :class="{'selected': current.is_liked==1, 'animate': isZanList(current.id)}">
                <span v-if="current.like_count > 0">{{current.like_count}}&nbsp;{{$t('gallery.like')}}</span>
            </a>
            <a v-show="!isHighLoading(current.id) && !isHighComplete(current.id) && !isHighHide(current.id)"
               @click="toggleHigh" href="javascript:;" class="popup-gallery__btn__text">
                {{$t('gallery.look_pic')}}
            </a>
            <a v-show="isHighLoading(current.id)" href="javascript:;" class="popup-gallery__btn__loading"><span></span></a>
            <a v-show="isHighComplete(current.id)"  href="javascript:;" class="popup-gallery__btn__text">{{$t('gallery.complete_pic')}}</a>

            <a v-if="isPrint" href="javascript:;" @click="addPrint" class="popup-gallery__btn__print">
                <span>{{$t('gallery.print')}}</span>
            </a>
        </div>
        <div class="popup-gallery__remark" v-if="type==2 && current">
            <div class="popup-gallery__remark__content" v-html="current.content"></div>
        </div>
    </div>
</template>
<script>
    import PhotoSwipe from '../../node_modules/photoswipe/dist/photoswipe.min'
    import PhotoSwipeUI_Default from '../../node_modules/photoswipe/dist/photoswipe-ui-default.min'
    import weui from 'weui.js'
    export default{
        props: {
            type: {
                type: String,
                default: '1'
            },
            id: {
                type: String,
                default: 'pswp-container'
            },
            list: {
                type: Array,
                default: []
            },
            value: {
                type: Boolean,
                default: false
            },
            index: {
                type: Number,
                default: 0
            },
            isWaterfall: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            value() {
                if (this.value) {
                    let _this = this
                    for (let [index, el] of this.list.entries()) {
                        if (index > (this.swpierList.length - 1))
                        this.swpierList.push({
                            src: el.pic + this.watermark,
                            w: el.pic_width,
                            h: el.pic_height
                        })
                    }
                    const options = {
                        index: this.index,
                        closeEl:false,
                        captionEl: false,
                        fullscreenEl: false,
                        zoomEl: false,
                        shareEl: false,
                        counterEl: false,
                        arrowEl: false,
                        preloaderEl: false,
                        isClickableElement: function(el) {
                            return _this.isAndroid && el.tagName === 'IMG';
                        },
                        tapToToggleControls: false,
                        bgOpacity: 0.9
                    }

                    let pswp = new PhotoSwipe(document.getElementById(this.id), PhotoSwipeUI_Default, this.swpierList, options)
                    pswp.init()
                    pswp.listen('close', () => {
                        _this.toggleClose()
                    });
                    pswp.listen('afterChange', () => {
                        _this.current = _this.list[pswp.getCurrentIndex()]
                    });

                    this.pswp = pswp
                    this.current = this.list[this.index]
                }
            }
        },
        data() {
            return {
                current: null,
                pswp: null,
                start: 0,
                end: 0,
                swpierList: [],
                highList: [],
                highListLoading: [],
                highListComplete: [],
                highListHide: [],
                zanList: [],
            }
        },
        computed: {
            watermark() {
                if (!this.isWaterfall) {
                    return ''
                }
                let watermark = '?x-oss-process=image/resize,w_750'
                try{
                    watermark += this.meeting.settings.iphoto.watermark_string
                } catch(e) {}

                return watermark
            }
        },

        methods: {
            //触发关闭
            toggleClose() {
                this.$emit('input', false)
                this.pswp.close()
            },
            //查看高清图
            toggleHigh() {
                let _this = this
                let p = this.current
                let index = this.pswp.getCurrentIndex()
                let image = this.pswp.currItem.container.children[0]
                if (image.tagName != 'IMG') {
                    image = this.pswp.currItem.container.children[1]
                }
                _this.highListLoading.push(p.id)
                let watermark = '?x-oss-process=image/resize,w_1125'
                try {
                    watermark += _this.meeting.settings.iphoto.watermark_string
                } catch(e) {}

                image.src = p.pic + watermark
                image.onload = function() {
                    _this.swpierList[index].src= this.src
                    _this.highListLoading.splice(_this.highListLoading.indexOf(p.id), 1)
                    _this.highListComplete.push(p.id)
                    setTimeout(function() {
                        _this.highListComplete.splice(_this.highListComplete.indexOf(p.id), 1)
                        _this.highListHide.push(p.id)
                    }, 1000)
                }

            },
            isHighLoading(id) {
                return this.highListLoading.indexOf(id) > -1
            },
            isHighComplete(id) {
                return this.highListComplete.indexOf(id) > -1
            },
            isHighHide(id) {
                return this.highListHide.indexOf(id) > -1
            },
            isZanList(id) {
                return this.zanList.indexOf(id) > -1
            },
            //我给你点赞
            addZan() {
                let index = this.pswp.getCurrentIndex()
                let is_liked = parseInt(this.current.is_liked)
                let like_count = parseInt(this.current.like_count)
                this.zanList.push(this.current.id)
                let _this = this
                setTimeout(function() {
                    _this.zanList.splice(_this.zanList.indexOf(_this.current.id), 1)
                }, 500)
                this.current.is_liked = is_liked ? 0 : 1
                this.current.like_count = is_liked ? --like_count : ++like_count
                this.list[index] = this.current
                this.$parent.list[index] = this.current

                this.$http.post('photo/like', {
                    invitation_id: this.user.id,
                    photo_id: this.current.id,
                    is_add: this.current.is_liked
                })
                event.stopPropagation()
                event.preventDefault()
                return false
            },
            //添加打印
            addPrint() {
                let loading = weui.loading()
                let _this = this
                this.$http.post('iphoto/cart/add', {
                    type: 2,
                    photos: [{
                        photo_id: this.current.id,
                        quantity: 1
                    }]
                }).then((response) => {
                    loading.hide()

                    let tip = '已经加入购物车<br/>请在<a href="' + this.url('/user/buy') + '" style="color: #00b459">我的->待打印列表</a>中查看'
                    if (this.lang == 'en') {
                        tip = 'Added to the shopping cart<br/>Please look at<a hre="' + this.url('/user/buy') + '" style="color: #00b459">Me->To be printed</a>'
                    }
                    if (response.data.err == 0) {
                        weui.alert(tip, {
                            className: 'photo-dialog',
                            buttons: [{
                                label: this.$t('gallery.print_got_it'),
                                type: 'primary',
                                onClick: function(){ console.log('ok') }
                            }]
                        });
                        this.$store.commit('PRINT')
                    } else {
                        weui.topTips(this.$t('gallery.print_cart_fail'))
                    }
                })
            }
        }
    }
</script>
