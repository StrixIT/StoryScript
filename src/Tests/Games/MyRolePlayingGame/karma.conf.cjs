var webPackConfig = import('../../../../webpack/webpack.base');
var configFunction = require('../../karma.conf.cjs');

module.exports = function(config) {
  config.set(configFunction(config, webPackConfig, '../../', './Games/MyRolePlayingGame', '../Games/MyRolePlayingGame', '../Games/MyRolePlayingGame'));
}