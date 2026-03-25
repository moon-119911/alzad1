import fs from 'fs';
import path from 'path';

const sourceDir = '/tmp/alzada1-extracted';
const files = [];

function walkDir(dir, relativePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);
    
    if (entry.isDirectory()) {
      walkDir(fullPath, relPath);
    } else {
      files.push(relPath);
    }
  }
}

walkDir(sourceDir);

// Output as JSON
console.log(JSON.stringify(files, null, 2));
