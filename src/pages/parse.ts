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
    const rootDir = process.cwd()

    const cmsDataFilePath = path.join(rootDir, 'src/cms/data.json');

    let cmsContent = JSON.parse(fs.readFileSync(cmsDataFilePath, 'utf8') || '{}');

    const textComponentRegex = /<Text\s+(?:[^>]*?\s+)?t=({[^}]*}|"[^"]*"|'[^']*')(?:\s+[^>]*?)?\s*(\/>|>)(?![^<]*<\/Text>)/g;
    let match;

    let usesCMS = false;

    while ((match = textComponentRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        // Check if the matched string already has an id attribute
        if (fullMatch.includes('id="') || fullMatch.includes('id={') || fullMatch.includes('id=\'')) {
            continue; // Skip this match
        }
        const startIndex = match.index;
        const id = generateUniqueId();
        cmsContent[id] = null;

        let replacement = fullMatch.endsWith('/>')
            ? fullMatch.replace('/>', ` cms={data['${id}']} id="${id}" />`)
            : fullMatch.replace(/>/, ` cms={data['${id}']} id="${id}">`);

        content = content.substring(0, startIndex) + replacement + content.substring(startIndex + fullMatch.length);

        console.log('Matched string --> ', fullMatch);
        console.log('Replacement string --> ', replacement);
        usesCMS = true;
        fs.writeFileSync(filePath, content);
    }

    fs.writeFileSync(cmsDataFilePath, JSON.stringify(cmsContent, null, 2));

    if (usesCMS) {
      const dataImportStatement = 'import data from "@/cms/data.json"';
      // Check if data is already imported in the frontmatter
      const hasFrontMatterMarkup = content.includes('---\n');
      const hasDataImportStatement = content.includes(dataImportStatement);
      
      if (hasFrontMatterMarkup && !hasDataImportStatement) {
        console.log('Adding data import statement to frontmatter')
        const frontmatterRegex = /---[\s\S]*?---/;
  
        const frontmatterMatch = content.match(frontmatterRegex)
        const frontmatter = frontmatterMatch[0]
        
        const frontmatterLines = [
          dataImportStatement,  
          ...(frontmatter.split('\n'))
        ]
        const newFrontmatter = frontmatterLines.join('\n')
  
        content = content.replace(frontmatter, newFrontmatter)
  
      }
  
      if (!hasFrontMatterMarkup) {
        console.log('Adding frontmatter markup with data import statement')
        content = `---\n${dataImportStatement}\n---\n${content}`
      }
  
      fs.writeFileSync(filePath, content);
    }

};

export const GET: APIRoute = async ({ request }) => {
    const rootDir = process.cwd()

    const cmsDataFilePath = path.join(rootDir, 'src/data.json');

    readAstroFiles(rootDir)

    return new Response(
        JSON.stringify({
            message: "Done Parsing",
            log: astroFiles
        }),
        { status: 200 }
    );
};
