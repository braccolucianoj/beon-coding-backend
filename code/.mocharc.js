'use strict';
module.exports = {
  'allow-uncaught': false,
  'async-only': false,
  bail: false,
  'check-leaks': false,
  color: true,
  delay: false,
  diff: true,
  exit: false,
  extension: ['ts'],
  jobs: 1,
  package: './package.json',
  parallel: false,
  recursive: false,
  reporter: 'spec',
  'reporter-option': ['foo=bar', 'baz=quux'],
  retries: 1,
  slow: '75',
  sort: false,
  spec: ['**/*.s.js'],
  timeout: 5000,
  'trace-warnings': true,
  ui: 'bdd',
  'v8-stack-trace-limit': 100,
  watch: false,
  'watch-files': ['**/*.ts', '**/*.test.ts'],
};