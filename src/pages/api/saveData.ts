import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';

export const GET: APIRoute = async ({ params, request }) => {
  const rootDir = process.cwd()
  const searchParams = new URL(request.url).searchParams
  const id = searchParams.get('id')
  const value = searchParams.get('value')
  let content = fs.readFileSync(path.join(rootDir, 'src/cms/data.json'), 'utf8');

  let data = JSON.parse(content)

  data[id] = value

  console.log('data....', data, params, )

  fs.writeFileSync(path.join(rootDir, 'src/cms/data.json'), JSON.stringify(data))


  return new Response(
    JSON.stringify({ result: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}