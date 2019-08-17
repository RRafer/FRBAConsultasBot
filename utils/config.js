let config = {
	mongoEnabled: false,
	features: {},
};

if (config.mongoEnabled) {
	//config.features = loadConfigFromDB();
} else {
	config.features[-1001262375149] = {
		enableDeleteSystemMessages: false,
		enableLinks: false,
		enableValidateUsers: true,
		enableGoogle: false,
		enableAdmin: true,
	};
	// defaults
	config.features[0] = {
		enableDeleteSystemMessages: false,
		enableLinks: false,
		enableValidateUsers: true,
		enableGoogle: false,
		enableAdmin: true,
	};
}

module.exports = { config };