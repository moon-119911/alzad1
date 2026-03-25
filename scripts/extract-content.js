import AdmZip from 'adm-zip';

const zipUrl = 'https://v0chat-agent-data-prod.s3.us-east-1.amazonaws.com/vm-binary/z1G25bvSJ5q/c109bd83700c8fb407787144f49e2bda42446a5f35eca50b76970e6421d5b20a.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA52KF4VHQDTZ5RDMT%2F20260325%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260325T234741Z&X-Amz-Expires=3600&X-Amz-Signature=7699db5f719b02d877ea02100fecc4591f98b24a6af60e0cd46b5acba8fa02d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject';

// Files to extract in this batch
const filesToExtract = process.argv.slice(2);

async function extractContent() {
  try {
    const response = await fetch(zipUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    
    for (const entry of entries) {
      if (entry.isDirectory) continue;
      
      let entryName = entry.entryName;
      if (entryName.startsWith('alzada1/')) {
        entryName = entryName.substring('alzada1/'.length);
      }
      
      if (filesToExtract.length === 0 || filesToExtract.includes(entryName)) {
        const content = entry.getData().toString('utf8');
        console.log(`\n===FILE:${entryName}===`);
        console.log(content);
        console.log(`===ENDFILE===`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

extractContent();
