import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TextStyleDropdown({ toolbar }) {
  const activeOption = Object.keys(toolbar).find(item => toolbar[item].active)
  return (
    <select
      onChange={e => {
        const textType = e.target.value
        const toolbarItem = toolbar[textType]
        if (toolbarItem && toolbarItem.run) {
          toolbarItem.run()
        }
      }}
      value={activeOption || ""}
    >
      {Object.keys(toolbar).map((type) => (
        <option
          value={type}
        >{type}</option>
      ))}
      <option value="">-</option>
    </select>
  )
}
