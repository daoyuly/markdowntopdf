import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownPreviewProps {
  content: string
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700">{children}</li>
            ),
            code: ({ children, className }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                )
              }
              return (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-800">{children}</code>
                </pre>
              )
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
                {children}
              </blockquote>
            ),
            a: ({ children, href }) => (
              <a 
                href={href} 
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700">{children}</em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default MarkdownPreview 