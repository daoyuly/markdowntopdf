import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { i18nConfig } from './config'

// 导入语言包
import en from './locales/en.json'
import zh from './locales/zh.json'

const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: i18nConfig.fallbackLng,
    debug: i18nConfig.debug,
    
    interpolation: i18nConfig.interpolation,
    
    detection: {
      order: i18nConfig.detectionOrder,
      caches: i18nConfig.caches,
    },
    
    backend: {
      loadPath: i18nConfig.loadPath,
    },
    
    ns: i18nConfig.namespaces,
    defaultNS: i18nConfig.defaultNS,
    
    // 语言检测
    lng: undefined, // 让检测器自动检测
    
    // 支持的语言
    supportedLngs: i18nConfig.supportedLanguages,
    
    // 非严格模式，允许回退到默认语言
    nonExplicitSupportedLngs: true,
    
    // 加载选项
    load: 'languageOnly',
    
    // 预加载语言
    preload: i18nConfig.supportedLanguages,
    
    // 初始化完成后的回调
    initImmediate: false,
    
    // 重试选项
    retry: {
      retryDelay: 1000,
      maxRetries: 3
    }
  })

export default i18n
