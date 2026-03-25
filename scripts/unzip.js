import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

const zipUrl = 'https://v0chat-agent-data-prod.s3.us-east-1.amazonaws.com/vm-binary/z1G25bvSJ5q/4091d1bd2465beffcfb6b140f0a61dbabc501ef1ebb4b79b5e5d18470f71a309.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA52KF4VHQDTZ5RDMT%2F20260325%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260325T234209Z&X-Amz-Expires=3600&X-Amz-Signature=da54b68604ef752ce4de1e5e183273f6b7fc04318d118e631fe996d2bd05c5cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject';
const outputDir = '/tmp/alzada1-extracted';

async function extractFiles() {
  try {
    console.log('Downloading zip file...');
    const response = await fetch(zipUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    
    // Clean and create output dir
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });
    
    console.log(`Extracting ${entries.length} entries to ${outputDir}...`);
    
    for (const entry of entries) {
      const targetPath = path.join(outputDir, entry.entryName);
      
      if (entry.isDirectory) {
        fs.mkdirSync(targetPath, { recursive: true });
      } else {
        const dir = path.dirname(targetPath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(targetPath, entry.getData());
        console.log(`Extracted: ${entry.entryName}`);
      }
    }
    
    console.log('Done! Files extracted to:', outputDir);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

extractFiles();
