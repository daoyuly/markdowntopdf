import { useState, useEffect, useRef } from 'react'
import { useEditorStore } from '../stores/editorStore'
import MarkdownPreview from './MarkdownPreview'
import FileUploader from './FileUploader'
import EditorHeader from './EditorHeader'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { basicSetup } from 'codemirror'

const Editor = () => {
  const { content, documentName, setContent } = useEditorStore()
  const [isPreview, setIsPreview] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (editorRef.current && !editorViewRef.current) {
      const state = EditorState.create({
        doc: content,
        extensions: [
          basicSetup,
          markdown(),
          EditorView.updateListener.of((update: { docChanged: boolean; state: EditorState }) => {
            if (update.docChanged) {
              setContent(update.state.doc.toString())
            }
          })
        ]
      })
      
      const view = new EditorView({
        state,
        parent: editorRef.current
      })
      
      editorViewRef.current = view
    }
  }, [])

  useEffect(() => {
    if (editorViewRef.current && content !== editorViewRef.current.state.doc.toString()) {
      const transaction = editorViewRef.current.state.update({
        changes: {
          from: 0,
          to: editorViewRef.current.state.doc.length,
          insert: content
        }
      })
      editorViewRef.current.dispatch(transaction)
    }
  }, [content])

  const renderEditorContent = () => {
    return (
      <div className="h-full flex" style={{ height: 'calc(100vh - 159px)' }}>
        {/* Editor */}
        <div className="flex-1 relative">
          <div 
            ref={editorRef}
            className="w-full h-full editor-codemirror"
          />
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
        {/* File Upload Overlay */}
        {content.length === 0 && <FileUploader />}
      </div>
    </div>
  )
}

export default Editor 