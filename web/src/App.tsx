import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WasmDemo from './components/WasmDemo'
import { useAuthStore } from './stores/authStore'
import Navigation from './components/Navigation'

function App() {
  const { } = useAuthStore()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleSwitchToRegister = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/wasm-demo" element={<WasmDemo />} />
      <Route path="/" element={
        <div className="flex h-screen bg-gray-100 ">
          {/* <Navigation /> */}
          <Sidebar onLoginClick={() => setShowLoginModal(true)} />
          <div className="flex-1 flex flex-col min-h-0">
            <Editor />
          </div>
          {showLoginModal && (
            <LoginModal 
              onClose={() => setShowLoginModal(false)} 
              onSwitchToRegister={handleSwitchToRegister}
            />
          )}
          {showRegisterModal && (
            <RegisterModal 
              onClose={() => setShowRegisterModal(false)} 
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}
        </div>
      } />
    </Routes>
  )
}

export default App 