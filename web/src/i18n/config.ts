import type { LanguageCode } from './types'

// i18n 配置选项
export const i18nConfig = {
  // 默认语言
  defaultLanguage: 'en' as LanguageCode,
  
  // 支持的语言列表
  supportedLanguages: ['en', 'zh'] as LanguageCode[],
  
  // 语言检测顺序
  detectionOrder: ['localStorage', 'navigator', 'htmlTag'],
  
  // 缓存选项
  caches: ['localStorage'],
  
  // 调试模式
  debug: process.env.NODE_ENV === 'development',
  
  // 插值选项
  interpolation: {
    escapeValue: false, // React 已经转义了
  },
  
  // 命名空间
  namespaces: ['translation'],
  
  // 默认命名空间
  defaultNS: 'translation',
  
  // 回退语言
  fallbackLng: 'en',
  
  // 加载路径
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  
  // 语言映射
  languageMap: {
    'en': 'en-US',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'ko': 'ko-KR'
  } as Record<LanguageCode, string>,
  
  // 日期格式选项
  dateFormatOptions: {
    en: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    zh: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  },
  
  // 数字格式选项
  numberFormatOptions: {
    en: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    zh: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  }
}

// 语言信息配置
export const languageInfo = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    locale: 'en-US',
    direction: 'ltr'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    locale: 'zh-CN',
    direction: 'ltr'
  }
} as const

// 获取语言信息
export const getLanguageInfo = (code: LanguageCode) => {
  return languageInfo[code] || languageInfo.en
}

// 检查语言是否支持
export const isLanguageSupported = (code: string): code is LanguageCode => {
  return i18nConfig.supportedLanguages.includes(code as LanguageCode)
}

// 获取浏览器语言
export const getBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language.split('-')[0]
  return isLanguageSupported(browserLang) ? browserLang as LanguageCode : 'en'
}

// 获取存储的语言
export const getStoredLanguage = (): LanguageCode => {
  const stored = localStorage.getItem('i18nextLng')
  return stored && isLanguageSupported(stored) ? stored as LanguageCode : 'en'
}
