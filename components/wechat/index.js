/**
 * Created by peterzhang on 2017/5/15.
 */

import wx from 'weixin-js-sdk'
import axios from 'axios'
class Wechat {
    constructor (title, desc, link, imgUrl) {
        console.log(link)
        axios.post('wechat/ticket', {
            url: encodeURIComponent(location.href.split('#')[0])
        }).then((response) => {
            if (response.data.err == 0) {
                let res = response.data.res
                console.log(res.app_id)
                wx.config({
                    debug: false,
                    appId: res.app_id,
                    timestamp: res.timestamp,
                    nonceStr:  res.noncestr,
                    signature: res.signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                        //'onMenuShareQQ',
                        //'onMenuShareWeibo',
                        //'onMenuShareQZone'
                    ]
                })

                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                    });
                    wx.onMenuShareAppMessage({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                    });
                    /*
                    wx.onMenuShareQQ({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                    });
                    wx.onMenuShareWeibo({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                    });
                    wx.onMenuShareQZone({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                    });*/

                })
            }

        })
    }
}

export default Wechat
