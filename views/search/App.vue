<template>
    <v-layout :reverse="true">
        <div class="search-photo" v-if="status==0 || status==2">
            <div class="search-photo__holder"></div>
            <p v-if="status==0" class="search-photo__desc" v-html="$t('search.take_pic_text')"></p>
            <p v-if="status==2" class="search-photo__desc" v-html="$t('search.take_none_text')"></p>
            <button class="button button-primary" @click="chooseImage">
                <a class="button-primary__camera" href="javascript:;">
                    <span v-if="status==0">{{$t('search.take')}}</span>
                    <span v-if="status==2">{{$t('search.take_re')}}</span>
                    <input @click="chooseImage" type="file" @change="uploadPhoto" accept="image/png,image/jpeg,image/gif"/>
                </a>
            </button>
        </div>
        <div class="search-photo" v-if="status==1 || status==3">
            <div class="search-loading__holder"></div>
            <p class="search-photo__desc" v-if="status==1" v-html="$t('search.take_face_waiting')"></p>
            <p class="search-photo__desc" v-if="status==3" v-html="$t('search.take_photo_waiting')"></p>
        </div>
        <div class="search-photo" v-if="status==4">
            <div class="search-without__holder"></div>
            <p class="search-photo__desc" v-html="$t('search.take_pic_none')"></p>
        </div>
        <div v-infinite-scroll="getList"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
            <v-grid :total="total" :list="list"></v-grid>
        </div>
        <v-bar slot="bar" current="find"></v-bar>
    </v-layout>
</template>
<script>
import weui from 'weui.js'
import wx from 'weixin-js-sdk'
export default{
    data(){
        return {
            status: 0,//0未拍过照片 1人脸识别中 2人脸未设别 3人脸识别玩命找你, 4人脸识别未找到照片 5 //找到了照片
            list: [],
            page: 1,
            total: 0,
            loading: true,
            tt: null,
            local_id: '',
        }
    },
    mounted() {
        if(this.isWechat) {
            let self = this
            this.$http.post('wechat/ticket', {
                url: location.href.split('#')[0]
            }).then((response) => {
                let res = response.data.res
                wx.config({
                    debug: false,
                    appId: res.app_id,
                    timestamp: res.timestamp,
                    nonceStr:  res.noncestr,
                    signature: res.signature,
                    jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData']
                })
                wx.ready(function () {
                    self.getUserAlbum()
                })
                wx.error(function(res){
                    console.log(res)
                })
            })
        } else {
            this.getUserAlbum()
        }
    },
    methods: {
        chooseImage() {
            if (this.isWechat && this.isAndroid) {
                event.stopPropagation()
                event.preventDefault()
                let self = this
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        if(res.localIds.length > 0) {
                            self.local_id = res.localIds[0]
                            self.uploadPhoto()
                        }

                    }
                });
                return false
            }
        },
        getUserAlbum () {
            if (!this.user) {
                return
            }
            clearTimeout(this.tt)
            //获取照片列表
            this.$http.post('photo/face').then((response) => {
                if (response.data.err == 0) {
                    let res = response.data.res
                    if(res) {
                        if (res.face_search_status == -1) {
                            this.status = 2
                        } else if (res.face_search_status == 1) {
                            this.status = 5
                        } else {
                            this.status = 3
                        }
                    } else {
                        this.status = 0
                    }
                }
            }).then(() => {
                let self = this
                if(this.status != 5) {
                    this.$store.commit('SPIN')
                }
                if(this.status == 1 || this.status == 3) {
                    this.tt = setTimeout(function() {
                        self.getUserAlbum()
                    }, 1000)
                } else if(this.status == 5) {
                    //获取图片列表
                    this.getList()
                }
            })

        },

        //会议相册列表
        getList () {
            let self = this
            this.loading = true
            this.$http.post('photo/face/list', {
                meeting_id: this.meeting.id,
                user_id: this.user.id,
                page: this.page,
                limit: 15,
            }).then((response) => {
                if (response.data.err == 0) {
                    let ret = response.data.res
                    for(let el of ret.list) {
                        self.list.push(el)
                    }
                    self.total = ret.total
                    self.page = parseInt(self.page) + 1
                    this.$nextTick(() => {
                        if(self.total > self.list.length) {
                            self.loading = false
                        }
                    })
                }
            }).then((response) => {
                this.$store.commit('SPIN')
            })
        },
        uploadPhoto(e) {
            let self = this

            weui.confirm(self.$t('search.tip_text'), {
                title: self.$t('search.tip'),
                className: 'photo-dialog',
                buttons: [{
                    label: self.$t('search.tip_cancel'),
                    type: 'default',
                    onClick: () => {
                        return true
                    }
                }, {
                    label: self.$t('search.tip_ok'),
                    type: 'primary',
                    onClick: () => {
                        //开始上传
                        let loading = weui.loading(self.$t('search.tip_uploading'))
                        if (this.isWechat && this.isAndroid) {
                            let formData = {}
                            wx.getLocalImgData({
                                localId: this.local_id, // 图片的localID
                                success: function (res) {
                                    formData.meeting_id = self.meeting.id
                                    formData.base64_code = res.localData // localData是图片的base64数据，可以用img标签显示
                                    self.uploadHttp(formData, loading)
                                }
                            });

                        } else {
                            let formData = new FormData()
                            formData.append('meeting_id', self.meeting.id)
                            formData.append('attachment', e.target.files[0])
                            self.uploadHttp(formData, loading)
                        }
                    }
                }]
            })
        },

        uploadHttp(formData, loading) {
            let self = this
            this.$http.post('photo/face/upload', formData).then((response) => {
                loading.hide()
                if (response.data.err == 0) {
                    weui.toast(self.$t('search.upload_success'), {
                        duration: 1000,
                        callback: function() {
                            self.getUserAlbum()
                        }
                    })

                } else {
                    weui.topTips(response.data.msg || self.$t('search.upload_failed'))
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .btn {
        position: relative;
    }
    input[type="file"] {
        opacity: 0;
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 1;
    }
</style>
