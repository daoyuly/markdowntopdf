import { useState, useRef } from 'react'
import { Download, LogIn } from 'lucide-react'
import { useEditorStore } from '../stores/editorStore'
import { useAuthStore } from '../stores/authStore'
import MarkdownPreview from './MarkdownPreview'
import { generatePDF } from '../utils/pdfGenerator'
import { Link } from 'react-router-dom'

const Editor = () => {
  const { content, documentName, setContent, setDocumentName } = useEditorStore()
  const { isLoggedIn } = useAuthStore()
  const [isPreview, setIsPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setContent(text)
        setDocumentName(file.name.replace(/\.[^/.]+$/, ''))
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = async () => {
    try {
      await generatePDF(content, documentName)
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
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

      {/* Editor/Preview Toggle */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded text-sm ${
              !isPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded text-sm ${
              isPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        {isPreview ? (
          <MarkdownPreview content={content} />
        ) : (
          <div className="h-full flex">
            {/* Line Numbers */}
            <div className="w-12 bg-gray-50 border-r border-gray-200 p-2 text-xs text-gray-500 font-mono">
              {content.split('\n').map((_, index) => (
                <div key={index} className="text-right">
                  {index + 1}
                </div>
              ))}
            </div>
            
            {/* Editor */}
            <div className="flex-1 relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none"
                placeholder="Start typing your Markdown here..."
              />
              
              {/* File Upload Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-400">
                  <p>Drop your Markdown file here or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:underline pointer-events-auto"
                  >
                    click to browse
                  </button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload markdown file"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Editor 