import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const zipUrl = 'https://v0.blob.core.windows.net/v0-blob/ad8b4cec-8d6a-4e2f-8c4a-1a25c0a3f988';
const projectRoot = '/vercel/share/v0-project';

async function extractAndCopy() {
  try {
    console.log('Downloading zip file...');
    const response = await fetch(zipUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Opening zip file...');
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    
    console.log(`Found ${entries.length} entries in archive`);
    
    for (const entry of entries) {
      if (entry.isDirectory) {
        console.log(`Skipping directory: ${entry.entryName}`);
        continue;
      }
      
      // Remove the top-level folder name (alzada1/) from the path
      let relativePath = entry.entryName;
      if (relativePath.startsWith('alzada1/')) {
        relativePath = relativePath.substring('alzada1/'.length);
      }
      
      if (!relativePath || relativePath === '') {
        continue;
      }
      
      const targetPath = path.join(projectRoot, relativePath);
      const targetDir = path.dirname(targetPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Write file
      const content = entry.getData();
      fs.writeFileSync(targetPath, content);
      console.log(`Written: ${relativePath}`);
    }
    
    console.log('All files extracted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

extractAndCopy();
