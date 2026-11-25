// Jedna komenda kontrolna: node tools/check.mjs [--ci]
// Lokalnie stempluje release; z --ci tylko sprawdza, czy stempel jest aktualny.
import {spawnSync} from 'node:child_process';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const ci = process.argv.includes('--ci');
const failures = [];
const run = (cmd, args, opts = {}) => spawnSync(cmd, args, {encoding: 'utf8', ...opts});
const step = (name, fn) => {
  try { const note = fn(); console.log(`OK   ${name}${note ? ` (${note})` : ''}`); }
  catch (error) { failures.push(name); console.log(`BŁĄD ${name}\n     ${String(error.message).trim().replace(/\n/g, '\n     ')}`); }
};
const listFiles = (dir, suffix) => existsSync(dir)
  ? readdirSync(dir, {recursive: true}).map(String).filter(n => n.endsWith(suffix)).map(n => join(dir, n))
  : [];

step('Składnia modułów js/', () => {
  const files = listFiles('js', '.js');
  for (const file of files) {
    const result = run(process.execPath, ['--input-type=module', '--check'], {input: readFileSync(file)});
    if (result.status !== 0) throw new Error(`${file}\n${result.stderr}`);
  }
  return `${files.length} plików`;
});

step('Poprawny JSON', () => {
  for (const file of ['manifest.webmanifest', 'backup-testowy.json']) JSON.parse(readFileSync(file, 'utf8'));
});

step('Testy (tests/*.test.mjs)', () => {
  const files = listFiles('tests', '.test.mjs');
  if (!files.length) throw new Error('Brak testów w tests/.');
  const result = run(process.execPath, ['--test', ...files]);
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
  return `${files.length} plików`;
});

step('Stempel release w sw.js i index.html', () => {
  const before = ['sw.js', 'index.html'].map(f => readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));
  const python = ['python', 'python3'].find(cmd => run(cmd, ['--version']).status === 0);
  if (!python) throw new Error('Nie znaleziono Pythona do tools/stamp_release.py.');
  const result = run(python, ['tools/stamp_release.py']);
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
  const after = ['sw.js', 'index.html'].map(f => readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));
  const changed = before.some((text, i) => text !== after[i]);
  if (changed && ci) throw new Error('Release był nieaktualny. Uruchom lokalnie: node tools/check.mjs');
  return changed ? 'zaktualizowano stempel' : 'aktualny';
});

step('Prywatne dokumenty poza gitem', () => {
  const git = args => run('git', ['-c', 'safe.directory=*', ...args]);
  const tracked = git(['ls-files', '--', 'private', 'docs/architecture.md', 'docs/pomysly.md']);
  if (tracked.status !== 0) throw new Error(tracked.stderr);
  if (tracked.stdout.trim()) throw new Error(`Śledzone przez git:\n${tracked.stdout}`);
  const ignored = git(['check-ignore', '-q', 'private/x.md']);
  if (ignored.status !== 0) throw new Error('.gitignore nie ignoruje katalogu private/.');
  if (git(['rev-parse', '--verify', '-q', 'origin/main']).status === 0) {
    const leaked = git(['log', '--oneline', 'origin/main..HEAD', '--', 'private', 'docs/architecture.md']);
    if (leaked.stdout.trim()) throw new Error(`Niewypchnięte commity dotykają prywatnych plików:\n${leaked.stdout}`);
  }
});

console.log(failures.length ? `\nNie przeszło: ${failures.join(', ')}` : '\nWszystko przeszło.');
process.exit(failures.length ? 1 : 0);
