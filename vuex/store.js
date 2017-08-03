/**
 * Created by peterzhang on 2017/4/25.
 */
import Vue from "vue";
import Vuex from "vuex";
import Cookie from 'vue-cookie'
let night = Cookie.get('night', true)
let tip = Cookie.get('tip', true)
let cover = Cookie.get('cover', 0)
let lang = Cookie.get('lang', 'zh')
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        user: null,
        meeting: null,
        spin: true,
        lang: lang ? lang : 'zh',
        night: (night=='false' || night === false) ? false : true,
        cover: cover,
        needCover: true,
        request: () => {},
        print: false,
        tip: (tip=='false' || tip === false) ? false : true,
    },
    mutations: {
        //用户
        USER(state, user) {
            state.user = user
        },
        //会议
        MEETING(state, meeting) {
            state.meeting = meeting
        },
        //动画效果
        SPIN(state, spin = false) {
            state.spin = !!spin
            try {
                let spinner = document.getElementById('v-spinner')
                if (spinner) {
                    spinner.style.display = 'none'
                    spinner.remove()
                }
            } catch (e) {

            }
        },
        //语言版本
        LANG(state, lang) {
            state.lang = lang
            Cookie.set('lang', lang)
        },
        //夜间模式
        NIGHT(state, night) {
            state.night = night
            Cookie.set('night', night)
        },
        //关闭Cover
        COVER(state, cover) {
            state.cover = cover
            Cookie.set('cover', cover)
        },
        PRINT(state, print = true) {
            state.print = print
        },
        NeedCover(state, needCover = false) {
            state.needCover = needCover
        },
        TIP(state, tip = false) {
            state.tip = tip
            Cookie.set('tip', tip)
        }
    },
})
