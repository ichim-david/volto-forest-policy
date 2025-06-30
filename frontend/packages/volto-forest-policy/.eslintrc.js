const fs = require('fs');
const path = require('path');

// Find the project root and core location
const projectRootPath = path.resolve(__dirname, '../../..');
let coreLocation;
if (fs.existsSync(`${projectRootPath}/frontend/core`))
  coreLocation = `${projectRootPath}/frontend/core`;
else if (fs.existsSync(`${projectRootPath}/core`))
  coreLocation = `${projectRootPath}/core`;

const { AddonRegistry } = require('@plone/registry/addon-registry');
const { registry } = AddonRegistry.init(`${coreLocation}/packages/volto`);

// Extends ESlint configuration for adding the aliases to `src` directories in Volto addons
const addonAliases = Object.keys(registry.packages).map((o) => [
  o,
  registry.packages[o].modulePath,
]);

// Get the main frontend node_modules path for core dependencies
const frontendNodeModules = `${projectRootPath}/frontend/node_modules/.pnpm`;

// Helper function to find the correct package path in pnpm node_modules
function findPackagePath(packageName) {
  try {
    const pnpmDir = `${frontendNodeModules}`;
    if (!fs.existsSync(pnpmDir)) return null;

    const entries = fs.readdirSync(pnpmDir);
    const packageDirs = entries.filter((entry) =>
      entry.startsWith(`${packageName}@`),
    );

    if (packageDirs.length > 0) {
      // Sort by version and take the latest (this is a simple approach)
      const latestDir = packageDirs.sort().pop();
      const packagePath = `${pnpmDir}/${latestDir}/node_modules/${packageName}`;
      if (fs.existsSync(packagePath)) {
        return packagePath;
      }
    }
  } catch (error) {
    console.warn(
      `Could not find package path for ${packageName}:`,
      error.message,
    );
  }
  return null;
}

// Get core Volto dependencies that might be needed by addons
function getCoreVoltoAliases() {
  try {
    const voltoPackageJson = require(
      `${coreLocation}/packages/volto/package.json`,
    );
    const coreDependencies = Object.keys(voltoPackageJson.dependencies || {});

    // Common packages that addons typically import
    const commonPackages = [
      'redux',
      'react-redux',
      'redux-actions',
      'redux-thunk',
      'connected-react-router',
      'semantic-ui-react',
      'react-intl',
      'classnames',
      'moment',
      'lodash',
      'react-router',
      'react-router-dom',
      'react-router-config',
      'react-select',
      'react-dnd',
      'react-dnd-html5-backend',
      'react-sortable-hoc',
    ];

    return commonPackages
      .filter((pkg) => coreDependencies.includes(pkg))
      .map((pkg) => {
        const packagePath = findPackagePath(pkg);
        return packagePath ? [pkg, packagePath] : null;
      })
      .filter(Boolean);
  } catch (error) {
    console.warn('Could not load core Volto dependencies:', error.message);
    return [];
  }
}

module.exports = {
  extends: `${coreLocation}/packages/volto/.eslintrc`,
  rules: {
    'import/no-unresolved': 1,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          // Core Volto packages
          ['@plone/volto', `${coreLocation}/packages/volto/src`],
          ['@plone/volto-slate', `${coreLocation}/packages/volto-slate/src`],
          ['@plone/registry', `${coreLocation}/packages/registry/src`],

          // Current package
          ['@eeacms/volto-forest-policy', './src'],

          // EEACMS packages from local node_modules
          [
            '@eeacms/search/(.*)$',
            './node_modules/@eeacms/volto-searchlib/searchlib/$1',
          ],
          [
            '@eeacms/search',
            './node_modules/@eeacms/volto-searchlib/searchlib',
          ],
          [
            '@eeacms/volto-datablocks',
            './node_modules/@eeacms/volto-datablocks/src',
          ],
          [
            '@eeacms/volto-object-widget',
            './node_modules/@eeacms/volto-object-widget/src',
          ],

          // Core dependencies from main frontend node_modules (dynamically resolved)
          ...getCoreVoltoAliases(),

          // Add addon aliases
          ...addonAliases,
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
};
