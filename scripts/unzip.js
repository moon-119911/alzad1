import { execSync } from 'child_process';
import path from 'path';

const zipFile = '/vercel/share/v0-project/alzada1.zip';
const outputDir = '/vercel/share/v0-project';

try {
  execSync(`unzip -o "${zipFile}" -d "${outputDir}"`, { stdio: 'inherit' });
  console.log('Successfully unzipped the file!');
} catch (error) {
  console.error('Error unzipping:', error.message);
}
