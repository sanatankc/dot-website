// src/Tiptap.jsx
import { BubbleMenu, EditorProvider } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import data from "@/cms/data.json"
import commit from '../../pages/commit'
import BaseHeading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'
import { Node } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import BaseParagraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import BaseTextStyle from '@tiptap/extension-text-style'
import Underline from  '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { Toggle } from "@/components/ui/toggle"


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
  addAttributes() {
    return {
      class: {
        parseHTML: element => {
          return element.getAttribute('class')
        }
      }
    }
  },
})

export const TextStyle = BaseTextStyle.extend({
  addAttributes() {
    return {
      class: {
        parseHTML: element => {
          return element.getAttribute('class')
        }
      },
      style: {
        parseHTML: element => {
          return element.getAttribute('style')
        }
      }
    }
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


const TextEditor = ({id, content }) => {
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
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: false,
      }),
      TextStyle,
      Heading,
      Paragraph,
      Underline
    ],
    content: cms,
    onUpdate: ({ editor }) => {
      if (id) {
        commit(id, editor?.getHTML())
      } else {
        console.log("Doesn't have id.")
      }
    }
  }) 
  editor.chain().updateAttributes
  const toolbar = {
    "h1": {
      active: editor?.isActive('heading', { level: 1 }),
      run: () => editor?.chain().focus().setHeading({ level: 1 }).run(),
      fontStyle: true
    },
    "h2": {
      active: editor?.isActive('heading', { level: 2 }),
      run: () => editor?.chain().focus().setHeading({ level: 2 }).run(),
      fontStyle: true
    },
    "h3": {
      active: editor?.isActive('heading', { level: 3 }),
      run: () => editor?.chain().focus().setHeading({ level: 3 }).run(),
      fontStyle: true,
    },
    "p": {
      active: editor?.isActive('paragraph'),
      run: () => {
        editor?.chain().focus().setParagraph().run()
      },
      fontStyle: true
    },
    "bold": {
      active: editor?.isActive('bold'),
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    "italic": {
      active: editor?.isActive('italic'),
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    "underline": {
      active: editor?.isActive('underline'),
      run: () => editor?.chain().focus().toggleUnderline().run(),
    },
  }

  let fontStyleToolbar = {}
  
  Object.keys(toolbar).forEach(item => {
    if (toolbar[item]?.fontStyle) {
      fontStyleToolbar[item] = toolbar[item]
    }
  })

  
  // console.log('big paragraph', editor?.isActive('paragraph', {class: 'text-2xl'}))
  // console.log('big paragraph yellow', editor?.isActive('paragraph', editor?.getAttributes("paragraph").class.includes('text-yellow-300')))
  // console.log('big paragraph', editor?.isActive('paragraph', {class: 'text-2xl'}))
  // console.log('span black -> ', editor?.isActive('textStyle', { class: 'bg-black' }))
  

  return (
    <>
      {editor && 
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
        >

        <div className="bg-white max-w-min p-2 px-3 shadow-md rounded-lg border border-slate-700 flex flex-row gap-1">
          <TextStyleDropdown toolbar={fontStyleToolbar} />
          <Toggle
            value="bold"
            aria-label="Toggle bold" 
            className="border-slate-400"
            pressed={toolbar.bold.active}
            onClick={(pressed) => {
              console.log('bold click...')
              toolbar.bold.run()
            }}
          >
            <FontBoldIcon className="h-4 w-4" />
          </Toggle>
        </div>
      </BubbleMenu>}
      <EditorContent editor={editor}  />
    </>
  )
}

export default TextEditor