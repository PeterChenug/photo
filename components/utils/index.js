/**
 * Created by peterzhang on 2017/5/15.
 */
import UAParser from 'ua-parser-js'
const os = new UAParser().getOS()
exports.isWechat = function () {
    let ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') > -1) {
        return true
    } else {
        return false
    }
}

exports.isAndroid = function () {
    return os && os.name == 'Android'
}

exports.isIOS = function () {
    return os && os.name == 'iOS'
}
