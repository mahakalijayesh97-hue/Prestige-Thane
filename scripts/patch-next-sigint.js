const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../node_modules/next/dist/server/lib/start-server.js'),
  path.join(__dirname, '../node_modules/next/dist/esm/server/lib/start-server.js')
];

for (const f of files) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('process.exit(code ?? 0)')) {
      content = content.replace('process.exit(code ?? 0)', 'process.exit(typeof code === "number" ? code : 0)');
      fs.writeFileSync(f, content, 'utf8');
      console.log('Patched Next.js SIGINT handler in', path.basename(f));
    }
  }
}

