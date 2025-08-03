import { Edit3 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

interface SidebarProps {
  onLoginClick: () => void
}

const Sidebar = ({ onLoginClick }: SidebarProps) => {
  const { isLoggedIn, user, logout } = useAuthStore()

  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="text-sm">New document</span>
        <Edit3 size={16} className="text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold mb-4">Documents</h3>

      {!isLoggedIn ? (
        <button
          onClick={onLoginClick}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
        >
          Login to access your documents.
        </button>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-300 mb-4">
            Welcome, {user?.name}
          </div>
          <button
            onClick={logout}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar 