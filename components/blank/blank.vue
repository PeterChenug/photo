<template>
    <div class="container" id="container">
        <transition name="fade">
            <div class="page reverse">
                <div class="page__bd" :class="{'blank': blank}">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: {
        blank: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        spin() {
            return this.$store.state.spin
        }
    }
}
</script>
<style lang="less" scoped>
    .page__bd {
        padding-bottom: 44px;
        &.blank {
            padding-bottom: 0;
        }
    }

</style>
