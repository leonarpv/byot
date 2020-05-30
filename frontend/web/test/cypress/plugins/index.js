const cucumber = require("cypress-cucumber-preprocessor").default;
const browserify = require("@cypress/browserify-preprocessor");
const dotenvPlugin = require('cypress-dotenv');
const path = require('path');

module.exports = (on, config) => {
  const options = browserify.defaultOptions;
  options.browserifyOptions.plugin.unshift(['tsify']);
  on("file:preprocessor", cucumber(options));

  config = dotenvPlugin(config, {path: path.join(__dirname, '..', '..', '.env')}, true);
  config = dotenvPlugin(config, {path: path.join(__dirname, '..', '..', '.env.common')}, true);
  return config;
};
