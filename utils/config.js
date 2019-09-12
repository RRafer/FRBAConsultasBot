/**
 * Returns an object with config for each chat
 * @param {boolean} mongoEnabled 
 * @returns {Object}
 */
const config = (mongoEnabled) => {
	if (mongoEnabled) return loadConfigFromDB();
	return {
		'-1001262375149': {
			enableDeleteSystemMessages: false,
			enableLinks: false,
			enableValidateUsers: true,
			enableRotate: false,
			enableGoogle: false,
		},
		// defaults
		'0': {
			enableDeleteSystemMessages: false,
			enableLinks: false,
			enableValidateUsers: true,
			enableRotate: false,
			enableGoogle: false,
		},
	};
};

// No quiero usar THIS pero la otra manera que se me ocurre es pasarle un parametro mas que sea la config.
// Idk
// ~Loki

/**
 * Check if feature is enabled for that chatId.
 * @param {string} feature 
 * @param {number} chatId 
 * @returns {boolean} If that chat supports that function
 */
function isEnabledFor (feature, chatId) {return (this.features[chatId] && this.features[chatId][feature]) || this.features[0][feature]; };

module.exports = {
	features: config(false),
	isEnabledFor: isEnabledFor,
};