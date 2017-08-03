/**
 * Created by peterzhang on 2017/4/26.
 */
import Vue from 'vue'
import vLayout from 'components/layout'
import vBar from 'components/bar'
import vBlank from 'components/blank'
import vGrid from 'components/grid'
import store from '../vuex/store'
import queryString from 'query-string'
import axios from 'axios'
import Lazyload from 'vue-lazyload'
import InfiniteScroll from 'vue-infinite-scroll'
import utils from 'components/utils'
import VueI18n from 'vue-i18n'
import locales from 'components/locales'
import Cookie from 'vue-cookie'
import Wechat from 'components/wechat'
let holder = require('../assets/images/grid_holder.png')
let holder_white = require('../assets/images/grid_holder_white.png')
Vue.use(Lazyload, {
    loading: store.state.night ? holder : holder_white,
    error: store.state.night ? holder : holder_white
})

Vue.use(InfiniteScroll)
Vue.use(VueI18n)
Vue.component('vLayout', vLayout)
Vue.component('vBar', vBar)
Vue.component('vGrid', vGrid)
Vue.component('vBlank', vBlank)

const query = queryString.parse(location.search)
//记录微信回掉的token
if(query.api_token) {
    window.localStorage.setItem('token', query.api_token)
}
//global settings
{
    //获取登录信息
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('token')
    axios.defaults.headers.common['X-IPhoto-Request'] = true
    axios.defaults.baseURL = '/api/v1/frontend'
    Vue.config.warnExpressionErrors = false
}
const i18n = new VueI18n({
    locale: store.state.lang,
    messages: locales
})


/*
axios({
    method: 'post',
    url: 'meeting/loginByCode',
    data: {
        meeting_id: query.mid,
        code: '17006428510'
    }
})*/
axios.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.status != 200) {
        weui.topTips('请求失败! 请检查您的网络')
    }
    return response;
}, function (error) {
    // Do something with response error
    weui.topTips('请求失败! 请检查您的网络')
    return Promise.reject(error);
});

window.setDocumentTitle = function (title) {
    document.title = title;
    let ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') > -1) {
        if (/ip(hone|od|ad)/i.test(ua)) {
            let i = document.createElement('iframe');
            i.src = '/favicon.png?' + Math.random();
            i.style.display = 'none';
            i.onload = function () {
                setTimeout(function () {
                    i.remove();
                }, 100)
            }
            document.body.appendChild(i);
        }
    }
}


store.state.request = async function(needLogin = true) {
    let loginType = 2
    let repMeeting = await axios({
        method: 'post',
        url: 'meeting',
        data: {
            id: query.mid
        },
    });

    if (repMeeting.status == 200 && repMeeting.data.err == 0) {
        store.commit('MEETING', repMeeting.data.res)
        let night = Cookie.get('night')
        if (!night) {
            try {
                if (store.state.meeting.settings.iphoto.night_shift == 1) {
                    store.commit('NIGHT', true)
                } else {
                    store.commit('NIGHT', false)
                }
            } catch (e) {
                console.log('未设置夜间模式')
            }
        }

        //
        try {
            loginType = store.state.meeting.settings.register.is_public
        } catch (e) {
            console.log('登录方式未设置，默认未不公开报名')
        }

        //跳转到微信授权
        let wx_auth = Cookie.get('WX_AUTH')
        if (utils.isWechat() && (loginType != 2 && wx_auth != query.mid && query.WX_AUTH != 1)) {
            window.location.href = '/api/v1/frontend/wechat/auth?meeting_id=' + store.state.meeting.id
                + '&redirect_url=' + encodeURIComponent('/?mid=' + store.state.meeting.id);
            return 1;
        }
        if (query.WX_AUTH == 1) {
            Cookie.set('WX_AUTH', store.state.meeting.id)
        }

        //开启微信分享
        try {
            let title, description, image
            let share = store.state.meeting.settings.share
            let link = location.origin + '/?mid=' + store.state.meeting.id
            title = share.title
            if (!share.description) {
                description = title
            } else {
                description = share.description
            }
            image = share.image
            if (title && image && description) {
                //微信分享
                new Wechat(title, description, link, image)
            }
        } catch (e){
            console.log('微信分享出错了')
        }
    } else {
        return 1
    }

    //获取用户信息
    let repUser = await axios({
        method: 'post',
        url: 'user',
        data: {
            meeting_id: store.state.meeting.id
        }
    });
    if (repUser.status != 200) {
        return 1
    }
    if (repUser.data.err == 0 && repUser.data.res) {
        store.commit('USER', repUser.data.res)
    } else {
        //当页面需要登录时判断
        if (needLogin) {
            //微信登录公开报名
            if (loginType == 2) {
                window.location.href = '/api/v1/frontend/login/wechat?meeting_id=' + store.state.meeting.id
                    + '&redirect_url=' + encodeURIComponent('/?mid=' + store.state.meeting.id);
            } else {
                window.location.href = '/login?mid=' + store.state.meeting.id
            }

            //fix 原来location是异步的啊
            return 1
        }
    }
    window.setDocumentTitle(store.state.meeting.name)
}

Vue.prototype.$http = axios
Vue.mixin({
    computed: {
        meeting() {
            return store.state.meeting
        },
        user() {
            return store.state.user
        },
        lang() {
            return store.state.lang
        },
        query() {
            return query
        },
        isAndroid() {
            return utils.isAndroid()
        },
        isIOS() {
            return utils.isIOS()
        },
        isWechat() {
            return utils.isWechat()
        },
        isPrint() {
            try {
                if (store.state.meeting.settings.iphoto.is_print == 1) {
                    return true
                }
            } catch (e) {}
            return false
        },
        isSearch() {
            try {
                if (store.state.meeting.settings.iphoto.is_search == 1) {
                    return true
                }
            } catch (e) {}
            return false
        },
        isAlbum() {
            try {
                if (store.state.meeting.settings.iphoto.is_album == 1) {
                    return true
                }
            } catch (e) {}
            return false
        },
        loginType() {
            try {
                return store.state.meeting.settings.register.is_public
            } catch (e) {
                console.log(e)
            }

            return 2
        }
    },
    methods: {
        url(name) {
            if (name.indexOf('?') > -1) {
                return name + '&mid=' + this.meeting.id
            }
            return name + '?mid=' + this.meeting.id;
        }
    }
})

export {
    Vue,
    store,
    i18n
}
