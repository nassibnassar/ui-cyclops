module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false,
    preserveConsole: true,
    useSecureTokens: false,
  },
  branding: {
    favicon: { src: './icons/app.png' },
  },
  modules: {
    '@folio/cyclops' : {},
  },
};
