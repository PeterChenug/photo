/**
 * Created by peter on 17/3/2.
 */
import { Vue, store, i18n } from 'global'
import App from './App'

const app = new Vue({
    el: '#app',
    i18n: i18n,
    store,
    template: '<App/>',
    components: {
        App
    }
})

