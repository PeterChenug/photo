<template>
    <v-layout :reverse="true" :attach-style="attachStyle">
        <div class="login__holder"></div>
        <div class="login-form">
            <div v-if="loginType==1 || loginType==3">
                <div class="login-form__box">
                    <div class="login-form__box__bd">
                        <input type="text" v-model="mobile" class="login-form__phone" :placeholder="$t('login.placeholder_phone')"/>
                    </div>
                </div>
                <div class="login-form__box">
                    <div class="login-form__box__bd">
                        <input type="text" v-model="code" class="login-form__phone" :placeholder="$t('login.placeholder_smscode')"/>
                    </div>
                    <div class="login-form__box__ft">
                        <button v-if="timer<=0" class="button button-default" @click="getMobileCode">{{$t('login.smscode_text')}}</button>
                        <button v-else class="button button-default" disabled>{{timer}}s</button>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="login-form__box">
                    <div class="login-form__box__bd">
                        <input type="text" v-model="code" class="login-form__code" :placeholder="$t('login.placeholder_code')"/>
                    </div>
                </div>
            </div>

            <div class="login-form__box" style="margin-top: 20px">
                <div class="login-form__box__bd">
                    <button class="button button-primary" @click="login">{{$t('login.text')}}</button>
                </div>
            </div>
        </div>
    </v-layout>
</template>
<script>
    import weui from 'weui.js'
    export default {
        data(){
            return {
                mobile: '',
                code: '',
                timer: 0
            }
        },
        mounted() {
            this.$store.commit('SPIN')
        },
        created() {
            this.$store.commit('NeedCover', false)
        },
        computed: {
            loginBg() {
                try {
                    return this.meeting.settings.register.login_background
                } catch (e) {
                    console.log('背景图片未设置')
                }
            },
            attachStyle() {
                if (this.loginBg) {
                    return {
                        backgroundSize: '100% auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center top',
                        backgroundImage: 'url(' + this.loginBg + ')'
                    }
                }
            }
        },
        methods: {
            /**
             *检测手机号是否有效
             */
            checkMobile () {
                let reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
                if (reg.test(this.mobile)) {
                    return true
                }

                weui.topTips(this.$t('login.tip_mobile'))
                return false
            },
            //获取短信验证码
            getMobileCode() {
                let self = this
                if (!this.checkMobile()) {
                    return false
                }
                let loading = weui.loading()
                this.$http.post('register/code/sendCode', {
                    mobile: this.mobile
                }).then((response) => {
                    loading.hide()
                    if (response.data.err == 0) {
                        weui.toast(this.$t('login.tip_smscode_success'))
                        self.timer = 60
                        let tt = setInterval(() => {
                            self.timer -= 1
                        }, 1000)
                    } else {
                        weui.topTips(response.data.msg)
                    }
                })

                event.preventDefault()
                event.stopPropagation()
            },
            login() {
                let self = this
                let url = 'login/code'
                if (this.loginType == 1 || this.loginType == 3) {
                    if (!this.checkMobile()) {
                        return false
                    }

                    if (!this.code) {
                        weui.topTips(this.$t('login.placeholder_smscode'))
                        return false
                    }
                    url = 'login/mobile'
                } else {
                    if (!this.code) {
                        weui.topTips(this.$t('login.placeholder_code'))
                        return false
                    }
                }
                let loading = weui.loading()
                this.$http.post(url, {
                    meeting_id: this.meeting.id,
                    mobile: this.mobile,
                    code: this.code,
                    auth_code: this.code
                }).then((response) => {
                    loading.hide()
                    if (response.data.err == 0) {
                        let storage = window.localStorage
                        storage.setItem('token', response.data.res.api_token)
                        window.location.href = this.url('/')
                    } else {
                        weui.topTips(response.data.msg)
                    }
                })
                event.preventDefault()
                event.stopPropagation()
            }
        }
    }
</script>
<style lang="less" scoped>
    // Placeholder text
    .placeholder(@color) {
        // Firefox
        &::-moz-placeholder {
            color: @color;
            opacity: 1; // See https://github.com/twbs/bootstrap/pull/11526
        }
        &:-ms-input-placeholder { color: @color; } // Internet Explorer 10+
        &::-webkit-input-placeholder  { color: @color; } // Safari and Chrome
    }

    .login__holder {
        padding-top: 61.33%;
    }

    .login-form {
        position: relative;
        padding: 10px 20px;
    }
    .login-form__box {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        border: 1px solid rgba(48,47,44,.1);
    }
    .login-form__box__bd {
        flex: 1;
    }

    input {
        width: 100%;
        background: rgba(255, 255, 255, 0.14);
        height: 44px;
        border-radius: 2px;
        -webkit-appearance: none;
        outline: none;
        border: none;
        font-size: 15px;
        color: #999;
        .placeholder(rgba(153, 153, 153, 0.6));
        -webkit-font-smoothing: antialiased;
        &.login-form__code {
            text-align: center;
        }
        &.login-form__phone {
            text-indent: 10px;
        }
    }
    .button {
        width: 100%;
        &:disabled {
            color: #999;
        }
    }

    .login-form__box__ft {
        .button {
            font-size: 14px;
            padding: 0 10px;
            background: rgba(255, 255, 255, 0.14)!important;
            min-width: 90px;
        }
    }
</style>
