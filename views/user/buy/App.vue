<template>
    <v-layout :reverse="true">
        <div class="select-bar">
            <div class="clearfix">
                <a href="javascript:;" @click="toggleAllChecked" class="select-bar__check" :class="{'checked': isAllChecked}">全选</a>
                <a href="javascript:;" class="select-bar__count">
                    {{$t('buy.bar_check_select')}}{{count}}{{$t('buy.bar_check_unit')}}
                </a>
            </div>
        </div>
        <div class="select-list" v-infinite-scroll="getList"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
            <div class="grid-box clearfix" v-show="list.length > 0">
                <div v-for="(item, index) of list" class="grid-box__item">
                    <div class="grid-box__content" @click="toggleSelect(item, index)">
                        <div class="grid-box__img" v-lazy:background-image="item.photo.pic + '/b200'"></div>
                        <a href="javascript:;" class="select-list__check" :class="{'checked': item.checked}"></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="select-btn">
            <a href="javascript:;" @click="delCart" class="select-btn__del">
                {{$t('buy.btn_del')}}
            </a>
            <a href="javascript:;" @click="printCart" class="select-btn__print">
                {{$t('buy.btn_print')}}
            </a>
        </div>
    </v-layout>
</template>
<script>
    import weui from 'weui.js'
    export default{
        data(){
            return {
                page: 1,
                total: 0,
                list: [],
                isAllChecked: false,
                count: 0,
                loading: true
            }
        },
        mounted() {
            this.getList()
        },
        computed: {
            printPosition() {
                if (this.meeting.settings && this.meeting.settings.iphoto) {
                    if (this.lang == 'en' && this.meeting.settings.iphoto.printer_position_en) {
                        return this.meeting.settings.iphoto.printer_position_en
                    } else if (this.meeting.settings.iphoto.printer_position) {
                        return this.meeting.settings.iphoto.printer_position
                    }
                }
                return this.$t('buy.print_success')
            }
        },
        methods: {
            getAllChecked() {
                let flag = true
                for (let el of this.list) {
                    if (el.checked == false) {
                        flag = false
                        break;
                    }
                }
                this.isAllChecked = flag
            },
            getCheckedCount() {
                let count = 0;
                for (let el of this.list) {
                    if (el.checked) {
                        count += 1
                    }
                }

                this.count = count
            },
            toggleAllChecked() {
                let flag = !this.isAllChecked
                for (let el of this.list) {
                    el.checked = flag
                }
                this.isAllChecked = flag
                this.getCheckedCount()
            },
            toggleSelect(item, index) {
                item.checked = !item.checked
                this.getAllChecked();
                this.getCheckedCount()
            },
            //获取相册列表
            getList() {
                let _this = this
                this.$http.post('iphoto/cart', {
                    type: 2,
                    page: this.page,
                    limit: 15,
                }).then((response) => {
                    if (response.data.err == 0) {
                        let ret = response.data.res
                        for(let el of ret.list) {
                            el.checked = false
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

            delCart() {
                if (this.count <= 0) {
                    weui.topTips(this.$t('buy.select_tip'))
                    return
                }
                let list = []
                for (let el of this.list) {
                    if (el.checked) {
                        list.push(el.id)
                    }
                }
                let _this = this
                weui.confirm(_this.$t('buy.del_tip'), {
                    className: 'photo-dialog',
                    buttons: [{
                        label: _this.$t('buy.del_confirm_cancel'),
                        type: 'default',
                        onClick: function(){ console.log('no') }
                    }, {
                        label: _this.$t('buy.del_confirm_ok'),
                        type: 'primary',
                        onClick: function(){
                            let loading = weui.loading()
                            _this.$http.post('iphoto/cart/delete', {
                                type: 2,
                                item_id: list
                            }).then((response) => {
                                loading.hide();
                                if (response.data.err == 0) {
                                    weui.toast(_this.$t('buy.del_success'), {
                                        callback: function() {
                                            window.location.reload()
                                        }
                                    });
                                }
                            })
                        }
                    }]
                })


            },
            printCart() {
                if (this.count <= 0) {
                    weui.topTips(this.$t('buy.select_tip'))
                    return
                }
                let list = []
                for (let el of this.list) {
                    if (el.checked) {
                        list.push({
                            photo_id: el.photo.id,
                            quantity: 1
                        })
                    }
                }
                let _this = this
                this.$http.post('iphoto/print/buy', {
                    photos: list
                }).then((response) => {
                    if (response.data.err == 0) {
                        weui.alert(_this.printPosition, {
                            className: 'photo-dialog',
                            buttons: [{
                                label: _this.$t('buy.print_confirm_ok'),
                                type: 'primary',
                                onClick: function(){
                                    window.location.href = _this.url('/user')
                                }
                            }]
                        })
                    } else {
                        weui.topTips(response.data.msg)
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .select-bar {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        background-color: #F8F8F8;
        padding: 9px 20px 9px 7.5px;
        a {
            display: inline-block;
            height: 21px;
            line-height: 21px;
            font-size: 15px;
        }
    }
    .select-bar__check {
        color: rgba(0, 0, 0, 0.8);
        background-size: 19px 19px;
        background-position: left center;
        background-repeat: no-repeat;
        text-indent: 26px;
        background-image: url("../../../assets/images/untick.png");
        float: left;
        &.checked {
            background-image: url("../../../assets/images/tick.png");
        }
    }
    .select-bar__count {
        color: rgba(0, 0, 0, 0.4);
        float: right;
    }
    .select-list {
        padding-top: 39px;
    }
    .select-list__check {
        display: block;
        position: absolute;
        left: 5px;
        top: 5px;
        width: 19px;
        height: 19px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url("../../../assets/images/untick.png");
        background-size: 100% 100%;
        z-index: 1;
        &.checked {
            background-image: url("../../../assets/images/tick.png");
        }
    }

    .select-btn {
        display: block;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        z-index: 1;
        a {
            display: block;
            height: 44px;
            line-height: 44px;
            font-size: 17px;
            text-align: center;
        }
        .select-btn__print {
            flex: 1;
            background-image: linear-gradient(-155deg, #00D058 0%, #00C3AA 100%);
            color: #ffffff;
        }
        .select-btn__del {
            width: 135px;
            background-color: #F8F8F8;
            color: rgba(0, 0, 0, 0.8);
        }
    }
</style>
