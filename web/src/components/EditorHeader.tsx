import { Download, LogIn } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { generatePDF } from '../utils/pdfGenerator'
import { Link } from 'react-router-dom'

interface EditorHeaderProps {
  documentName: string
  content: string
}

const EditorHeader = ({ documentName, content }: EditorHeaderProps) => {
  const { isLoggedIn } = useAuthStore()

  const handleDownload = async () => {
    try {
      await generatePDF(content, documentName)
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">{documentName}</h1>
        <p className="text-sm text-gray-600">Markdown to PDF</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="btn-primary"
        >
          <Download size={16} />
          Download
        </button>
        {!isLoggedIn && (
          <button className="btn-secondary">
            <LogIn size={16} />
            <Link 
              to="/login" 
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Login
            </Link>
          </button>
        )}
      </div>
    </div>
  )
}

export default EditorHeader
