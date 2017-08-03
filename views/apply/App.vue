<template>
    <v-blank :class="{'apply': !is_apply}">
        <div class="apply-content" v-if="!is_apply">
            <form>
                <div class="form-group">
                    <input type="text" placeholder="姓名" v-model="name"/>
                </div>
                <div class="form-group">
                    <input type="tel" placeholder="手机号" v-model="mobile"/>
                </div>
                <!--
                <div class="form-group">
                    <input type="text" placeholder="短信验证码" v-model="code"/>
                    <a v-if="timer<=0" href="javascript:;" @click="toggleCode" class="verify-code">发送验证码</a>
                    <a v-else href="javascript:;" class="verify-code timer">{{timer}}s</a>
                </div>

                <div class="form-group">
                    <input type="text" placeholder="拍摄地点" v-model="address"/>
                </div>
                -->
                <div class="form-group">
                    <input type="date" placeholder="拍摄时间" v-model="time"/>
                </div>
                <div class="form-group">
                    <input type="text" placeholder="如有其他需求请注明" v-model="extra"/>
                </div>
            </form>
            <div class="apply-content__button">
                <button class="button button-default"
                        :class="{'disabled': !name || !mobile || !extra}" @click="toggleSubmit">提交申请</button>
            </div>
            <div class="apply-contnt__service">
                <p>客服热线</p>
                <a href="tel:400-100-9550">400-100-9550</a>
            </div>
        </div>

        <!--预约成功-->
        <div v-if="is_apply" class="apply-success">
            <div class="apply-success__holder"></div>
            <div class="apply-success__content">
                <h3>预约成功</h3>
                <p>我们将在两个工作日内联系您确认预约结果<br/>扫二维码关注公众号，第一时间获取确认信息</p>
                <div class="apply-success__qrcode"></div>

                <a href="/market/photographer" class="button button-block">返回首页</a>
            </div>
        </div>
    </v-blank>
</template>
<script>
import weui from 'weui.js'
    export default {
        data(){
            return {
                is_apply: false,
                name: '',
                mobile: '',
                code: '',
                time: '',
                address: '',
                extra: '',
                timer: 0

            }
        },
        components:{
        },
        mounted() {
            this.getList()
        },
        methods: {
            isDisabled() {
                return !this.name || !this.mobile || !this.extra
            },
            /**
             *检测手机号是否有效
             */
            checkMobile () {
                let reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
                if (reg.test(this.mobile)) {
                    return true
                }

                weui.topTips('请输入正确的手机号')
                return false
            },
            getList() {
                this.$http.post('iphoto/preorder/get', {
                    invitation_id: this.user ? this.user.id : 0,
                    limit: 1,
                    page: 1
                }).then((response) => {
                    if (response.data.err == 0 && response.data.res.total > 0) {
                        this.is_apply = true
                    }
                }).then(() => {
                    this.$store.commit('SPIN')
                })
            },
            toggleCode() {
                let _this = this

                if (!this.checkMobile()) {
                    return false
                }
                let loading = weui.loading()
                this.$http.post('register/code/sendCode', {
                    mobile: this.mobile
                }).then((response) => {
                    loading.hide()
                    if (response.data.err == 0) {
                        weui.toast('验证码已发送')
                        _this.timer = 30
                        let tt = setInterval(() => {
                            _this.timer--
                        }, 1000)
                    } else {
                        weui.topTips(response.data.msg)
                    }
                })
            },
            toggleSubmit() {
                if (this.isDisabled()) {
                    return false
                }
                if (!this.checkMobile()) {
                    return false
                }
                let loading = weui.loading()
                this.$http.post('iphoto/preorder/add', {
                    invitation_id: this.user ? this.user.id : 0,
                    name: this.name,
                    mobile: this.mobile,
                    code: this.code,
                    time: this.time,
                    address: this.address,
                    extra: this.extra
                }).then((response)=> {
                    loading.hide()
                    if (response.data.err == 0) {
                         this.is_apply = true
                    } else {
                        weui.topTips(response.data.msg)
                    }
                })
            }
        }

    }
</script>
<style lang="less" scoped>
    .apply-content {
        padding-top: 32%;
    }

    form {
        padding-left: 20px;
    }
    .form-group {
        padding-top: 30px;
        padding-bottom: 10px;
        position: relative;
        &:after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 1px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.2);
            transform-origin: 0 0;
            transform: scaleY(0.5);
        }
    }
    .apply-content__button {
        padding: 30px 20px;
    }
    .button {
        display: block;
        width: 100%;
    }

    input {
        border: none;
        min-height: 14px;
        font-size: 14px;
        background: transparent;
        color: #ffffff;
        width: 100%;
        &::-moz-placeholder {
            color: rgba(255, 255, 255, 0.6);
            opacity: 1; // See https://github.com/twbs/bootstrap/pull/11526
        }
        &:-ms-input-placeholder { color: rgba(255, 255, 255, 0.6);} // Internet Explorer 10+
        &::-webkit-input-placeholder  { color: rgba(255, 255, 255, 0.6); } // Safari and Chrome
    }
    .apply-contnt__service {
        text-align: center;
        color: #ffffff;
        p {
            font-size: 10px;
            margin-bottom: 10px;
        }
        a {
            font-size: 13px;
            color: #ffffff;
        }
    }

    .apply-success__holder {
        padding-top: 44%;
        background: url("../../assets/images/apply_success.png") no-repeat center;
        background-size: 216px auto;
    }
    .apply-success__content {
        padding: 0 20px;
        text-align: center;
        h3 {
            font-size: 20px;
            color: #00b459;
            line-height: 1;
            font-weight: 400;
            margin: 5px 0 15px;
        }

        p {
            font-size: 14px;
            color: #000;
            opacity: 0.4;
            line-height: 36/28;
        }

        .apply-success__qrcode {
            width: 180px;
            height: 180px;
            margin: 10px auto 30px auto;
            background: url("../../assets/images/apply_success_qrcode.png") no-repeat center;
            background-size: 100% 100%;
        }

    }
    .verify-code {
        display: block;
        width: 90px;
        padding: 7px 0;
        text-align: center;
        color: #ffffff;
        font-size: 14px;
        position: absolute;
        right: 20px;
        bottom: 13.5px;
        border-radius: 1px;
        border: 1px solid #ffffff;
        background: transparent;
        cursor: pointer;
        &.timer {
            background: rgba(255, 255, 255,0.2);
            border: none;
            color: rgba(255, 255, 255, 0.8);
        }
    }

</style>
