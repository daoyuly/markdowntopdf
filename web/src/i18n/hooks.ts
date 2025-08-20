import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { changeLanguage, getCurrentLanguage, getSupportedLanguages } from './utils'
import type { LanguageCode } from './types'

/**
 * 自定义 i18n hook，提供便捷的国际化功能
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation()

  /**
   * 切换语言
   */
  const switchLanguage = useCallback(async (language: LanguageCode) => {
    await changeLanguage(language)
  }, [])

  /**
   * 获取当前语言
   */
  const currentLanguage = getCurrentLanguage()

  /**
   * 获取支持的语言列表
   */
  const supportedLanguages = getSupportedLanguages()

  /**
   * 检查是否为当前语言
   */
  const isCurrentLanguage = useCallback((language: LanguageCode) => {
    return currentLanguage === language
  }, [currentLanguage])

  /**
   * 格式化翻译文本，支持插值
   */
  const formatMessage = useCallback((key: string, values?: Record<string, any>) => {
    return t(key, values)
  }, [t])

  /**
   * 获取翻译文本，如果不存在则返回默认值
   */
  const getMessage = useCallback((key: string, defaultValue?: string) => {
    const message = t(key)
    return message === key ? defaultValue || key : message
  }, [t])

  return {
    t,
    i18n,
    switchLanguage,
    currentLanguage,
    supportedLanguages,
    isCurrentLanguage,
    formatMessage,
    getMessage,
    ready: i18n.isInitialized
  }
}

/**
 * 语言切换 hook
 */
export const useLanguageSwitcher = () => {
  const { switchLanguage, currentLanguage, supportedLanguages } = useI18n()

  const handleLanguageChange = useCallback(async (language: LanguageCode) => {
    if (language !== currentLanguage) {
      await switchLanguage(language)
    }
  }, [switchLanguage, currentLanguage])

  return {
    currentLanguage,
    supportedLanguages,
    handleLanguageChange
  }
}

/**
 * 翻译 hook
 */
export const useTranslations = () => {
  const { t, formatMessage, getMessage } = useI18n()

  return {
    t,
    formatMessage,
    getMessage
  }
}
