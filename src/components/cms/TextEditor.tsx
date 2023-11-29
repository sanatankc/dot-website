// src/Tiptap.jsx
import { BubbleMenu, EditorProvider } from '@tiptap/react'
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

import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import TextStyleDropdown from './TextStyleDropdown'
import { useEffect, useState } from 'react'

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
        class: `text-xl`,
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
  const [cms, setCMS] = useState(() => {
    const cmsContent = window.localStorage.getItem('cmsContent');
    let value
    if (cmsContent) {
      value = JSON.parse(cmsContent)[id];
    }
    if (value) {
      return value
    }
    return content
  })

  const editor = useEditor({
    extensions: [StarterKit, Document, Paragraph, Text, TextStyle, Color, Heading],
    content: cms,
    onUpdate: ({ editor }) => {
      console.log('Updating', editor?.getHTML())
      commit(id, editor?.getHTML())  
    }
  })

  

  const save = (value: string) => {
    commit(id, editor?.getHTML())
  }

  return (
    <>
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        {/* <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'is-active' : ''}
        >
          bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'is-active' : ''}
        >
          italic
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive('strike') ? 'is-active' : ''}
        >
          strike
        </button> */}

        <div className="bg-white max-w-min p-2 px-3 shadow-md rounded-lg border border-slate-700 flex flex-row gap-1">
          <TextStyleDropdown />
          <ToggleGroup type="multiple" variant="outline" size="sm">
            <ToggleGroupItem value="bold" aria-label="Toggle bold" className="border-slate-400">
              <FontBoldIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic"  className="border-slate-400">
              <FontItalicIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough"  className="border-slate-400">
              <UnderlineIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </BubbleMenu>}
      <EditorContent editor={editor}  />
    </>
  )
}

export default TextEditor