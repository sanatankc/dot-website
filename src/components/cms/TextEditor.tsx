// src/Tiptap.jsx
import { EditorProvider } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import commit from '../../pages/commit'
import BaseHeading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'
import { Node } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import BaseParagraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

const Span = Node.create({
  
})

type Levels = 1 | 2 | 3

const classes: Record<Levels, string> = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-bold',
}

export const Heading = BaseHeading.configure({ levels: [1, 2, 3] }).extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0]

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `${classes[level]}`,
      }),
      0,
    ]
  },
})

export const Paragraph = BaseParagraph.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      `p`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `text-xl font-medium`,
      }),
      0,
    ]
  },
})

// // define your extension array
// const extensions = [
//   StarterKit.configure({
//     heading: false
//   }),
//   Heading,
//   Text,
//   TextStyle,
// ]


const TextEditor = ({id, content}) => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, TextStyle, Color, Heading],
    content: content,
  })

  const save = (value: string) => {
    commit(id, value)
  }

  return (
    <EditorContent editor={editor} />
  )
}

export default TextEditor