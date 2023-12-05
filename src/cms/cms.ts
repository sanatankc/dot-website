const toolbar = (editor) => {
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
    run: () => editor?.chain().focus().setParagraph().run(),
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