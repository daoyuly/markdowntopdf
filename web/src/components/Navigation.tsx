import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const Navigation = () => {
  const { isLoggedIn, logout } = useAuthStore()

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold text-gray-800">
            Markdown to PDF
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link 
                to="/login" 
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-primary text-sm"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome back!
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navigation 