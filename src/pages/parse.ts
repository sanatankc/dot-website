import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);

let astroFiles = []

function readAstroFiles(dir) {
  const filesAndFolders = fs.readdirSync(dir);

  filesAndFolders.forEach((item) => {
      const fullPath = path.join(dir, item);
      
      const stat = fs.statSync(fullPath);
      // ignore node_modules
      
      if (stat.isDirectory()) {
          if (item === 'node_modules') {
              return;
          }
          // If the item is a directory, recurse into it
          readAstroFiles(fullPath);
      } else if (path.extname(fullPath) === '.astro') {
          // If the item is a .astro file, process it
          processFileContent(fullPath);
      }
  });
}

const generateUniqueId = () => {
  // Simple example, consider a more robust unique ID generation method
  return 'id' + Math.random().toString(36).substr(2, 9);
};

const processFileContent = (filePath: string) => {
  console.log('Processing file --> ', filePath);
  let content = fs.readFileSync(filePath, 'utf8');

  const textComponentRegex = /<Text\s+(?:[^>]*?\s+)?t=({[^}]*}|"[^"]*"|'[^']*')(?:\s+[^>]*?)?\s*(?:\/>|>(?:\s*<\/Text>)?)/g;
  let match;
  let data = {};
  let offset = 0; // Offset to account for changes in string length due to replacements


  while ((match = textComponentRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const startIndex = match.index + offset; // Adjust start index by current offset
      const id = generateUniqueId();
      data[id] = null;

      
      
      let replacement = '';

      if (fullMatch.endsWith('/>')) {
        // For self-closing tags, insert the new props before '/>'
        replacement = fullMatch.replace('/>', ` cms={data['${id}']} id="${id}" />`);
    } else {
        // For open tags, insert the new props before '>'
        replacement = fullMatch.replace(/>/, ` cms={data['${id}']} id="${id}">`);
    }
      console.log('Matched --> \n', fullMatch)
      console.log('Change --> \n', replacement)

      content = content.substring(0, startIndex) + replacement + content.substring(startIndex + fullMatch.length);
      offset += replacement.length - fullMatch.length; // Update offset for next iteration

      console.log('Written')
  }

  return { content, data };
};


export const GET: APIRoute = async ({ request }) => {
  const rootDir = process.cwd()
  readAstroFiles(rootDir)

  return new Response(
    JSON.stringify({
      message: "Done Parsing",
      log: astroFiles
    }),
    { status: 200 }
  );
}
