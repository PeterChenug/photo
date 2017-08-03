<template>
    <v-layout :reverse="true">
        <div class="user">
            <a :href="url('/user/like')" class="cell">
                <div class="cell__bd">{{$t('my.like')}}</div>
                <div class="cell__ft">{{like_count}}</div>
            </a>
            <a v-if="isSearch" :href="url('/user/my')" class="cell">
                <div class="cell__bd">{{$t('my.have')}}</div>
                <div class="cell__ft">{{my_count}}</div>
            </a>
            <a v-if="isPrint" :href="url('/user/buy')" class="cell">
                <div class="cell__bd"><span :class="{'active': print_cart_count > 0}">{{$t('my.waiting')}}</span></div>
                <div class="cell__ft">{{print_cart_count}}</div>
            </a>
            <a v-if="isPrint" :href="url('/user/print')" class="cell">
                <div class="cell__bd"><span :class="{'active': print_printing_count > 0}">{{$t('my.printing')}}</span></div>
                <div class="cell__ft">{{print_printing_count}}</div>
            </a>
            <a v-if="isPrint" :href="url('/user/print?type=1')" class="cell">
                <div class="cell__bd">{{$t('my.printed')}}</div>
                <div class="cell__ft">{{print_complete_count}}</div>
            </a>
        </div>
        <div class="apply">
            <a :href="url('/apply')" class="apply-link"></a>
        </div>
        <!--<a class="shit" href="javascript:;"></a>-->
        <v-bar slot="bar" current="user"></v-bar>
    </v-layout>
</template>
<script>
    export default{
        data(){
            return{
                like_count: 0,
                my_count: 0,
                print_cart_count: 0,
                print_printing_count: 0,
                print_complete_count: 0

            }
        },
        components:{
        },
        mounted() {
            this.getCounts()
        },
        methods: {
            getCounts() {
                this.$http.post('photo/counts', {
                    invitation_id: this.user.id
                }).then((response) => {
                    if (response.data.err == 0) {
                        this.like_count = response.data.res.likes
                        this.my_count = response.data.res.photos
                        this.print_cart_count = response.data.res.printCart
                        this.print_printing_count = response.data.res.waiting
                        this.print_complete_count = response.data.res.printed
                    }
                }).then(() => {
                    this.$store.commit('SPIN')
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .user {
        padding-left: 20px;
    }
    .apply {
        padding: 20px;
        .apply-link {
            display: block;
            padding-top: 26.865672%;
            background: url("../../assets/images/subscribe_banner.png") no-repeat center;
            background-size: 100% 100%;
        }
    }
    .shit {
        display: block;
        position: absolute;
        right: 20px;
        bottom: 70px;
        width: 65px;
        height: 90px;
        background: url("../../assets/images/shit.png") no-repeat center;
        background-size: 65px 90px;
    }
</style>
