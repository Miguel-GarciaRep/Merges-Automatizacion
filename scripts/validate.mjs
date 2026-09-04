import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = decodeURIComponent(new URL('..', import.meta.url).pathname);
const requiredHtml = ['index.html', 'productos.html', 'servicios.html', 'pedidos.html', 'contacto.html', 'login.html', 'registro.html', 'comprar.html'];
const requiredDirs = ['js/models', 'js/views', 'js/controllers', 'js/utils', 'docs/architecture/adr', '.github/workflows'];

for (const dir of requiredDirs) {
  await readdir(join(root, dir));
}

for (const file of requiredHtml) {
  await readFile(join(root, file), 'utf8');
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const files = await walk(root);
const jsFiles = files.filter(file => extname(file) === '.js');
for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

const workflow = await readFile(join(root, '.github/workflows/deploy.yaml'), 'utf8');
for (const marker of ['pull_request:', 'npm ci', 'npm test', 'needs: validar', 'actions/upload-pages-artifact@v3', 'actions/deploy-pages@v4']) {
  if (!workflow.includes(marker)) throw new Error(`Falta en el workflow: ${marker}`);
}

const arc42 = await readFile(join(root, 'docs/architecture/arc42.md'), 'utf8');
for (const section of Array.from({ length: 12 }, (_, i) => `## ${i + 1}.`)) {
  if (!arc42.includes(section)) throw new Error(`Falta la sección arc42: ${section}`);
}

console.log(`OK: ${jsFiles.length} archivos JavaScript validaron sintaxis.`);
console.log(`OK: ${requiredHtml.length} páginas HTML requeridas existen.`);
console.log('OK: documentación arc42, ADR y workflow CI/CD presentes.');
