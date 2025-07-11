const { execSync } = require('child_process');

try {
  console.log('Running TypeScript compiler...\n');
  const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log('No TypeScript errors found!');
  console.log(output);
} catch (error) {
  console.log('TypeScript errors found:\n');
  console.log(error.stdout);
  console.log(error.stderr);
}