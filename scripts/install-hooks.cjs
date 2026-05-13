// Run `simple-git-hooks` only when this package is being installed at
// its own root (a contributor running `yarn install` after cloning) --
// NOT when it is being pulled in as a transitive dependency by another
// project. Without this guard, every consumer of
// `@compuzz-eventus/backbone` ends up with `simple-git-hooks` trying
// to wire `pre-commit` into THEIR `.git/hooks/`, which is not what
// they want.
//
// The detection: npm/yarn set `INIT_CWD` to the directory from which
// the install was started. For our own install that equals the
// package root (`..` from this script); for a consumer install it is
// the consumer's project root, which differs.

const path = require('node:path');
const {execSync} = require('node:child_process');

const initCwd = process.env.INIT_CWD;
const packageRoot = path.resolve(__dirname, '..');

if (!initCwd) {
  // No INIT_CWD (very old npm, or manual invocation): skip. The
  // contributor can run `yarn simple-git-hooks` by hand.
  process.exit(0);
}

if (path.resolve(initCwd) !== packageRoot) {
  // Installed as a dependency in another project; do nothing.
  process.exit(0);
}

try {
  execSync('npx simple-git-hooks', {stdio: 'inherit'});
} catch (err) {
  // Don't fail the whole install if hook wiring fails (e.g. no .git
  // directory because we are inside a tarball extract or a CI cache).
  // eslint-disable-next-line no-console
  console.warn('[install-hooks] skipped:', err.message);
}
