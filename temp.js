const pkg = require('./createProjectTemplate/package.json');

function ConvertToString([module, version]) {
  return `${module}@${version.replace('^', '')}`;
}

function FilterSelf([module, version]) {
  return module !== 'cra2'
}

const dependencies = Object.entries(pkg.dependencies).filter(FilterSelf).map(ConvertToString);
console.log(`\nnpm install -P ${ dependencies.join(' ') }`);

const devDepenencies = Object.entries(pkg.devDependencies).filter(FilterSelf).map(ConvertToString);
console.log(`\npm install -D ${ devDepenencies.join(' ')}`);
