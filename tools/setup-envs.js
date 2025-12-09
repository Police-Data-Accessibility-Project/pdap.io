const { copyFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const source = resolve(projectRoot, '.env.example');
const targets = ['.env.development', '.env.production'];

if (!existsSync(source)) {
  console.error('Missing .env.example. Cannot create env files.');
  process.exit(1);
}

for (const target of targets) {
  const destination = resolve(projectRoot, target);

  if (existsSync(destination)) {
    console.log(`Skipping ${target}; it already exists.`);
    continue;
  }

  copyFileSync(source, destination);
  console.log(`Created ${target} from .env.example.`);
}
