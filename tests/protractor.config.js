exports.config = {
  capabilities: {
   'browserName': 'chrome',
   'chromeOptions': {
       args: ['--disable-web-security']
   }
  },
  baseUrl: 'http://localhost:8100',
  specs: [
    'e2e-tests/**/*.tests.js'
  ],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true,
  }
};
