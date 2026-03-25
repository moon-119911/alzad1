import { execSync } from 'child_process';
import { existsSync } from 'fs';

const zipPath = '/vercel/share/v0-project/alzada1.zip';

if (existsSync(zipPath)) {
  console.log('Unzipping alzada1.zip...');
  execSync(`unzip -o "${zipPath}" -d /vercel/share/v0-project/`, { stdio: 'inherit' });
  console.log('Unzip complete!');
} else {
  console.log('Zip file not found');
}
