import Vue from 'vue'
import App from './App.vue'
import i18n from '@/locales'
import '@/plugin'

Vue.config.productionTip = false

new Vue({
	i18n,
	render: (h) => h(App)
}).$mount('#app')
