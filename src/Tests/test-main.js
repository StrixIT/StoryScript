require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: Array.from(window.__karma__.files),

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
})