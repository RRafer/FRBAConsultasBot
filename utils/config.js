let config = {
  mongoEnabled: false,
  features: {},
};

if (config.mongoEnabled) {
  config.features = loadConfigFromDB();
} else {
  config.features[-1001214086516] = {
    enableDeleteSystemMessages: false,
    enableLinks: false,
    enableValidateUsers: true,
  };
}
module.exports = { config };
