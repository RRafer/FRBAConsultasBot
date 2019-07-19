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
module.exports = { features: config(false) };
