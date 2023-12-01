import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);

function readAstroFiles(dir) {
    const filesAndFolders = fs.readdirSync(dir);

    filesAndFolders.forEach((item) => {
        const fullPath = path.join(dir, item);
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (item === 'node_modules') {
                return;
            }
            readAstroFiles(fullPath);
        } else if (path.extname(fullPath) === '.astro') {
            processFileContent(fullPath);
        }
    });
}

const generateUniqueId = () => {
    return 'id' + Math.random().toString(36).substr(2, 9);
};

const processFileContent = (filePath: string) => {
    console.log('Processing file --> ', filePath);

    let content = fs.readFileSync(filePath, 'utf8');
    const rootDir = process.cwd();
    const cmsDataFilePath = path.join(rootDir, 'src/cms/data.json');
    let cmsContent = JSON.parse(fs.readFileSync(cmsDataFilePath, 'utf8') || '{}');

    const textComponentRegex = /<Text\s+(?:[^>]*?\s+)?t=({[^}]*}|"[^"]*"|'[^']*')(?:\s+[^>]*?)?\s*(\/>|>)(?![^<]*<\/Text>)/g;
    const componentCmsRegex = /<(\w+)\s+([^>]*?_cms="[^"]*")[^>]*>/g;
    let match;

    let usesCMS = false;

    // Processing Text Components
    while ((match = textComponentRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        if (fullMatch.includes('id="') || fullMatch.includes('id={') || fullMatch.includes('id=\'')) {
            continue;
        }
        const id = generateUniqueId();
        cmsContent[id] = null;
        let replacement = fullMatch.endsWith('/>')
            ? fullMatch.replace('/>', ` id="${id}" />`)
            : fullMatch.replace(/>/, ` id="${id}">`);
        content = content.substring(0, match.index) + replacement + content.substring(match.index + fullMatch.length);
        usesCMS = true;
    }

    // Processing Components with _cms Props
    let componentMatch;
    while ((componentMatch = componentCmsRegex.exec(content)) !== null) {
        const componentName = componentMatch[1];
        const cmsProp = componentMatch[2];

        const id = generateUniqueId();
        cmsContent[id] = null;

        let replacement = `<${componentName} ${cmsProp} ${cmsProp}_data={data['${id}']} ${cmsProp}_id="${id}" />`;
        content = content.replace(componentMatch[0], replacement);
        usesCMS = true;
    }

    if (usesCMS) {
        fs.writeFileSync(filePath, content);
        fs.writeFileSync(cmsDataFilePath, JSON.stringify(cmsContent, null, 2));
    }
};

export const GET: APIRoute = async ({ request }) => {
    const rootDir = process.cwd();

    readAstroFiles(rootDir);

    return new Response(
        JSON.stringify({
            message: "Done Parsing",
            log: []
        }),
        { status: 200 }
    );
};
