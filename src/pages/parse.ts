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
  const content = fs.readFileSync(filePath, 'utf8');

  const textComponentRegex = /<Text\s+(?:[^>]*?\s+)?t=({[^}]*}|"[^"]*"|'[^']*')(?:\s+[^>]*?)?\s*(?:\/>|>(?:\s*<\/Text>)?)/g;
  let match;
  let data = {};

  while ((match = textComponentRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const id = generateUniqueId();
      data[id] = null;

      console.log('Matched --> \n', fullMatch)
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
