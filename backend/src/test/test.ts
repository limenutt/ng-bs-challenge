/* tslint:disable:no-require-imports no-var-requires non-literal-require no-console mocha-no-side-effect-code */
require('source-map-support').install();
if (!(<any>global)._babelPolyfill) {
  require('babel-polyfill');
}
function importTest(path: string, name?: string): void {
  describe(name || '', () => {
    try {
      require(path);
    } catch (error) {
      console.error(error.stack);
    }
  });
}

describe('API server', () => {
  importTest('./spec/server.spec');
  importTest('./spec/serverAPI.spec');
});
/* tslint:enable:no-require-imports no-var-requires non-literal-require no-console mocha-no-side-effect-code */
