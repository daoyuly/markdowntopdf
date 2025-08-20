import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const Navigation = () => {
  const { isLoggedIn, logout } = useAuthStore()
  const { t } = useTranslation()

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold text-gray-800">
            {t('editor.markdownEditor')}
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 语言切换器 */}
          <LanguageSwitcher />
          
          {!isLoggedIn ? (
            <>
              <Link 
                to="/login" 
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {t('auth.login')}
              </Link>
              <Link 
                to="/register" 
                className="btn-primary text-sm"
              >
                {t('auth.register')}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {t('messages.welcome')}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navigation 