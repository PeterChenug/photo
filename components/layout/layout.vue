<template>
    <div class="container" id="container" :class="{'daytime': !night}">
        <transition name="fade">
            <div class="page" :class="{'reverse': reverse}" v-show="!spin">
                <!--封面-->
                <div class="page-cover" v-if="needCover && cover!=meeting.id" :style="{backgroundImage: 'url('+ startup +')'}">
                    <div class="logo" v-if="!startup"></div>
                    <a @click="toggleCover" class="page-cover__btn" :class="{'white': startup}">进入直播相册</a>
                </div><!--end-->

                <div class="page__bd" :style="attachStyle">
                    <slot></slot>
                </div>
                <slot name="bar"></slot>
            </div>
        </transition>
    </div>
</template>
<script>
import Cookie from 'vue-cookie'
export default {
    props: {
        reverse: {
            type: Boolean,
            default: false
        },
        attachStyle: {
            type: Object,
            default: () => {
                return {}
            }
        }

    },
    computed: {
        spin() {
            return this.$store.state.spin
        },
        night() {
            return this.$store.state.night
        },
        cover() {
            return this.$store.state.cover
        },
        needCover() {
            return this.$store.state.needCover
        },
        startup() {
            try {
                return this.meeting.settings.iphoto.homepage_bg
            } catch (e) {}

            return ''
        }
    },
    methods: {
        toggleCover() {
            //this.$store.commit('COVER', this.meeting.id)
            Cookie.set('cover', this.meeting.id)
            window.location.href = this.url('/')
        }
    }
}
</script>
<style lang="less" scoped>
    .page-cover {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 9999999;
        background: #ffffff;
        padding-top: 18.47%;
        .logo {
            width: 100%;
            height: 160px;
            background: url("../../assets/images/cover_logo.gif") no-repeat center;
            background-size: 200px 160px;
        }
        background-position: center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .page-cover__btn {
        display: block;
        width: 50.68%;
        height: 44px;
        line-height: 44px;
        position: absolute;
        left: 50%;
        bottom: 120px;
        transform: translateX(-50%);
        color: #00b459;
        font-size: 17px;
        text-align: center;
        border: 1px solid #00b459;
        border-radius: 1px;
        &.white {
            color: #fff;
            border-color: #fff;
        }
    }
</style>
