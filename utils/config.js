let config = {
	mongoEnabled: false,
	features: {},
};

if (config.mongoEnabled) {
	config.features = loadConfigFromDB();
} else {
	config.features[-1001262375149] = {
		enableDeleteSystemMessages: false,
		enableLinks: false,
		enableValidateUsers: true,
		enableGoogle: false,
		enableStatus: false,
		enableEcoBici: false,
		enableBici: false,
		enableSubte: false,
	};
	// defaults
	config.features[0] = {
		enableDeleteSystemMessages: false,
		enableLinks: false,
		enableValidateUsers: true,
		enableGoogle: false,
		enableStatus: false,
		enableEcoBici: false,
		enableBici: false,
		enableSubte: false,
	};
}
module.exports = { config };
