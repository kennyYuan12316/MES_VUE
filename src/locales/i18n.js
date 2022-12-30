import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en'
import usLocal from './zh-CN'
import zhHK from '@/locales/zh-HK'
import zhJP from '@/locales/ja-JP'
import ruRU from '@/locales/ru-RU'
Vue.use(VueI18n)
const messages = {
    en_US: {
        ...enLocale
    },
    zh_CN: {
        ...usLocal
    },
    zh_HK: {
        ...zhHK
    },
    ja_JP: {
        ...zhJP
    },
    ru_RU: {
        ...ruRU
    }
}
const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || 'zh_CN',
    messages
})

export default i18n
