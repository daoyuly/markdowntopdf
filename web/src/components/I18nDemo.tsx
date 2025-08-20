import { useTranslation } from 'react-i18next'
import { useI18n, useLanguageSwitcher } from '../i18n/hooks'
import { formatDate, formatNumber, formatCurrency } from '../i18n/utils'
import { useState } from 'react'

const I18nDemo = () => {
  const { t } = useTranslation()
  const { currentLanguage, supportedLanguages } = useI18n()
  const { handleLanguageChange } = useLanguageSwitcher()
  const [count, setCount] = useState(0)

  const currentDate = new Date()
  const sampleNumber = 1234.56
  const sampleAmount = 99.99

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🌍 i18n 国际化演示
        </h2>
        
        {/* 语言切换 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {t('languages.en')} / {t('languages.zh')}
          </h3>
          <div className="flex gap-2">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            当前语言: {currentLanguage}
          </p>
        </div>

        {/* 基础翻译 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            基础翻译示例
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">通用文本</h4>
              <p className="text-sm text-gray-600">
                {t('common.loading')} | {t('common.success')} | {t('common.error')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">认证相关</h4>
              <p className="text-sm text-gray-600">
                {t('auth.login')} | {t('auth.register')} | {t('auth.logout')}
              </p>
            </div>
          </div>
        </div>

        {/* 表单验证 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            表单验证消息
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              {t('validation.required')} | {t('validation.minLength', { min: 6 })} | {t('validation.email')}
            </p>
          </div>
        </div>

        {/* 格式化示例 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            格式化示例
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">日期</h4>
              <p className="text-sm text-gray-600">
                {formatDate(currentDate)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">数字</h4>
              <p className="text-sm text-gray-600">
                {formatNumber(sampleNumber)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">货币</h4>
              <p className="text-sm text-gray-600">
                {formatCurrency(sampleAmount, 'USD')}
              </p>
            </div>
          </div>
        </div>

        {/* 动态内容 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            动态内容示例
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => setCount(Math.max(0, count - 1))}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -
              </button>
              <span className="text-lg font-medium">{count}</span>
              <button
                onClick={() => setCount(count + 1)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {count === 0 && t('messages.welcome')}
              {count === 1 && t('messages.documentSaved')}
              {count > 1 && t('messages.fileUploaded')}
            </p>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            💡 使用说明
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• 使用 <code className="bg-blue-100 px-1 rounded">useTranslation()</code> hook 获取翻译函数</p>
            <p>• 使用 <code className="bg-blue-100 px-1 rounded">t('key')</code> 获取翻译文本</p>
            <p>• 支持插值：<code className="bg-blue-100 px-1 rounded">t('key', { var: 'value' })</code></p>
            <p>• 语言切换器已集成到导航栏中</p>
            <p>• 语言偏好会自动保存到 localStorage</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default I18nDemo
