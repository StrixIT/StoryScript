var webPackConfig = import('../../../webpack/webpack.base.js');
var configFunction = require('../karma.conf.cjs');

module.exports = async function(config) {
  config.set(configFunction(config, await webPackConfig, './Engine', '../Games/MyRolePlayingGame', '../Engine'));
}