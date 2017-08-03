<template>
    <div class="tabbar">
        <a :href="url('/')" class="tabbar__item" :class="{'is-selected': current=='home'}">
            <span class="tabbar__icon tabbar__icon__home"></span>
            <div class="tabbar__label">{{$t('tabbar.home')}}</div>
        </a>
        <a v-if="isAlbum" :href="url('/album')" class="tabbar__item" :class="{'is-selected': current=='album'}">
            <span class="tabbar__icon tabbar__icon__album"></span>
            <div class="tabbar__label">{{$t('tabbar.album')}}</div>
        </a>
        <a v-if="isSearch && isWechat" :href="url('/search')" class="tabbar__item" :class="{'is-selected': current=='find'}">
            <span class="tabbar__icon tabbar__icon__find"></span>
            <div class="tabbar__label">{{$t('tabbar.search')}}</div>
        </a>
        <a :href="url('/user')" class="tabbar__item" :class="{'is-selected': current=='user'}">
            <span class="tabbar__icon tabbar__icon__profile"></span>
            <div class="tabbar__label">{{$t('tabbar.user')}}</div>
        </a>
    </div>
</template>
<script>
    export default{
        props: {
            current: {
                type: String,
                default: 'home'
            }
        }
    }
</script>
