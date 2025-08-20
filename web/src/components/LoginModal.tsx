import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Lock, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'

interface LoginModalProps {
  onClose: () => void
  onSwitchToRegister: () => void
}

interface LoginFormData {
  email: string
  password: string
}

const LoginModal = ({ onClose, onSwitchToRegister }: LoginModalProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')
    
    try {
      const success = await login(data.email, data.password)
      if (success) {
        onClose()
      } else {
        setError(t('auth.invalidCredentials'))
      }
    } catch (err) {
      setError(t('auth.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">MARKDOWN TO PDF</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                {...register('email', { 
                  required: t('auth.emailRequired'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('auth.invalidEmail')
                  }
                })}
                type="email"
                id="email"
                className="input-field"
                placeholder={t('auth.enterEmail')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                {...register('password', { 
                  required: t('auth.passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('auth.passwordTooShort')
                  }
                })}
                type="password"
                id="password"
                className="input-field"
                placeholder={t('auth.enterPassword')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                {t('auth.forgotPassword')}
              </a>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Lock size={16} />
                  {t('auth.login')}
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2 text-sm">
            <p>
              {t('auth.dontHaveAccount')}{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('auth.register')}
              </button>
            </p>
            <p>
              {t('auth.needHelp')}{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                {t('auth.contactSupport')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal 