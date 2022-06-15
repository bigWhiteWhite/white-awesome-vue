import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCn from './zh-cn'
import en from './en'
Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
	silentTranslationWarn: true, // 警告
	messages: {
		zhCn,
		en
	}
})

export default i18n
