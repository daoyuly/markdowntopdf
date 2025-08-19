import { useRef } from 'react'
import { useEditorStore } from '../stores/editorStore'

interface FileUploaderProps {
  onFileUpload?: (content: string, fileName: string) => void
}

const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const { setContent, setDocumentName } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const fileName = file.name.replace(/\.[^/.]+$/, '')
        
        // 调用 store 方法
        setContent(text)
        setDocumentName(fileName)
        
        // 调用可选的回调函数
        if (onFileUpload) {
          onFileUpload(text, fileName)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'text/markdown' || 
          file.type === 'text/plain' || 
          file.name?.endsWith('.md') || 
          file.name?.endsWith('.markdown') || 
          file.name?.endsWith('.txt')) {
        
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          const fileName = file.name?.replace(/\.[^/.]+$/, '')
          // 调用 store 方法
          setContent(text)
          setDocumentName(fileName)
          onFileUpload?.(text, fileName)
          
        }
        reader.readAsText(file)
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center text-gray-400">
        <p>Drop your Markdown file here or</p>
        <button
          onClick={handleClick}
          className="text-blue-500 hover:underline pointer-events-auto"
        >
          click to browse
        </button>
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
  )
}

export default FileUploader
