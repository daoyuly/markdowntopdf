import i18n from './index'

/**
 * 获取当前语言
 */
export const getCurrentLanguage = (): string => {
  return i18n.language
}

/**
 * 切换语言
 */
export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language)
  // 保存到 localStorage
  localStorage.setItem('i18nextLng', language)
}

/**
 * 获取支持的语言列表
 */
export const getSupportedLanguages = () => {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]
}

/**
 * 格式化日期
 */
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const currentLang = getCurrentLanguage()
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US'
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }).format(date)
}

/**
 * 格式化数字
 */
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  const currentLang = getCurrentLanguage()
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US'
  
  return new Intl.NumberFormat(locale, options).format(number)
}

/**
 * 格式化货币
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const currentLang = getCurrentLanguage()
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * 获取语言方向 (LTR/RTL)
 */
export const getTextDirection = (): 'ltr' | 'rtl' => {
  const currentLang = getCurrentLanguage()
  // 目前只支持 LTR 语言，未来可以扩展支持 RTL 语言
  return 'ltr'
}

/**
 * 检查是否为当前语言
 */
export const isCurrentLanguage = (language: string): boolean => {
  return getCurrentLanguage() === language
}

/**
 * 获取语言名称
 */
export const getLanguageName = (languageCode: string): string => {
  const languages = getSupportedLanguages()
  const language = languages.find(lang => lang.code === languageCode)
  return language?.name || languageCode
}
