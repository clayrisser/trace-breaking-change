import crossSpawn from 'cross-spawn';
import pkgDir from 'pkg-dir';

const rootPath = pkgDir.sync(process.cwd());

export default async function npm(command = 'help', args = []) {
  return new Promise((resolve, reject) => {
    const cp = crossSpawn('npm', [command, ...args], {
      cwd: rootPath,
      stdio: 'pipe'
    });
    let stdout = '';
    let stderr = '';
    cp.stderr.on('data', buffer => (stderr += buffer.toString()));
    cp.stdout.on('data', buffer => (stdout += buffer.toString()));
    cp.on('close', () => resolve(stdout));
    cp.on('error', () => reject(new Error(stderr)));
  });
}
