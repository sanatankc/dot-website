import React from 'react';
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const Toolbar = () => {
  return (
    <>
    <div className='w-full flex justify-center items-center'>
      <div className="bg-white max-w-min p-2 px-5 shadow-md rounded-full border border-slate-100">
        <ToggleGroup type="multiple" variant="outline">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <FontBoldIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <FontItalicIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
            <UnderlineIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
    </>
  );
};

export default Toolbar;