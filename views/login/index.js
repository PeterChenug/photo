/**
 * Created by peter on 17/3/2.
 */
import { Vue, store, i18n } from 'global'
import App from './App'
(async () => {
    let ret = await store.state.request(false)
    if (ret == 1) {
        return
    }
    const app = new Vue({
        el: '#app',
        i18n: i18n,
        store,
        template: '<App/>',
        components: {
            App
        }
    })
})()

