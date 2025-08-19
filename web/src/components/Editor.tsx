import { useState } from 'react'
import { useEditorStore } from '../stores/editorStore'
import MarkdownPreview from './MarkdownPreview'
import FileUploader from './FileUploader'
import EditorHeader from './EditorHeader'

const Editor = () => {
  const { content, documentName, setContent } = useEditorStore()
  const [isPreview, setIsPreview] = useState(false)


  const renderLineNumbers = () => {
    return content.split('\n').map((_, index) => (
      <div key={index} className="text-right">
        {index + 1}
      </div>
    ))
  }

  const renderEditorContent = () => {
    return (
      <div className="h-full flex" style={{ height: 'calc(100vh - 159px)' }}>
        {/* Line Numbers */}
        <div className="w-12 bg-gray-50 border-r border-gray-200 p-2 text-sm text-gray-500 font-mono line-numbers p-4">
          {renderLineNumbers()}
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none editor-textarea"
            placeholder="Start typing your Markdown here..."
          />

          {/* File Upload Overlay */}
          {content.length === 0 && <FileUploader />}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <EditorHeader documentName={documentName} content={content} />

      {/* Editor/Preview Toggle */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded text-sm ${!isPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
          >
            Editor
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded text-sm ${isPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white editor-container">
        {isPreview ? (
          <div className="editor-content">
            <MarkdownPreview content={content} />
          </div>
        ) : (
          renderEditorContent()
        )}
      </div>
    </div>
  )
}

export default Editor 