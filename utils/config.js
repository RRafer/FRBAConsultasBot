const config = (mongoEnabled) => {
  if (mongoEnabled) return loadConfigFromDB();
  return {
    -1001262375149: {
      enableDeleteSystemMessages: false,
      enableLinks: false,
      enableValidateUsers: true,
      enableRotate: false,
      enableGoogle: false,
    },
    // defaults
    0: {
      enableDeleteSystemMessages: false,
      enableLinks: false,
      enableValidateUsers: true,
      enableRotate: false,
      enableGoogle: false,
    },
  };
}

isEnabledFor = (feature, chatId) => 
  (config.features[chatId] && config.features[chatId][feature])
  || config.features[0][feature];

module.exports = {
  features: config(false),
  isEnabledFor: isEnabledFor,
};
