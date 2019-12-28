var webPackConfig = require('../../../../webpack/webpack.base');
var configFunction = require('../../karma.conf');

module.exports = function(config) {
  config.set(configFunction(config, webPackConfig, '../../', './Games/DangerousCave', '../Games/DangerousCave', '../Games/DangerousCave'));
}