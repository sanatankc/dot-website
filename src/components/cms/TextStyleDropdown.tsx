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

export default function TextStyleDropdown() {
  return (
    <select>
      <option value="1">h1</option>
      <option value="2">h2</option>
      <option value="3">h3</option>
      <option value="4">p</option>
      <option value="4">sm</option>
      <option value="4">sub</option>
    </select>
  )
}
