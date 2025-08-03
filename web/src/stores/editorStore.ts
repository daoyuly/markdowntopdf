import { create } from 'zustand'

interface EditorState {
  content: string
  documentName: string
  setContent: (content: string) => void
  setDocumentName: (name: string) => void
  clearContent: () => void
}

const defaultContent = `# Markdown to PDF

## We've converted 1,824,565 Markdown files to PDF and counting!

To convert your Markdown to PDF simply start by typing in the editor or pasting from your clipboard.

If your Markdown is in a file clear this content and drop your file into this editor.

## GitHub flavoured styling by default

We now use GitHub flavoured styling by default.`

export const useEditorStore = create<EditorState>((set) => ({
  content: defaultContent,
  documentName: 'DOCUMENT NAME',
  setContent: (content: string) => set({ content }),
  setDocumentName: (name: string) => set({ documentName: name }),
  clearContent: () => set({ content: '' })
})) 