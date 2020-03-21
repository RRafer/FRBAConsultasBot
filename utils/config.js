/**
 * Returns an object with config for each chat
 * @param {boolean} mongoEnabled 
 * @returns {Object}
 */
const config = (mongoEnabled) => {
	if (mongoEnabled) return loadConfigFromDB();
	return {
		'-1001262375149': {
			enableDeleteSystemMessages: true,
			enableLinks: false,
			enableValidateUsers: false,
			enableRotate: false,
			enableGoogle: false,
			enableNuke: true,
			enableExcel: true
		},
		// defaults
		'0': {
			enableDeleteSystemMessages: true,
			enableLinks: false,
			enableValidateUsers: false,
			enableRotate: false,
			enableGoogle: false,
			enableNuke: true,
			enableExcel: true
		}
	};
};

const excelMessage = `¿Te fijaste en el <a href=\'https://docs.google.com/spreadsheets/d/19XPRP8zsVut-W1HihBxSZ_mZHlyHMBy-WIKNqurdNs8/edit?pref=2&pli=1#gid=1173209158\'>Excel de profesores</a>?`;

// No quiero usar THIS pero la otra manera que se me ocurre es pasarle un parametro mas que sea la config.
// Idk
// ~Loki

/**
 * Check if feature is enabled for that chatId.
 * @param {string} feature 
 * @param {number} chatId 
 * @returns {boolean} If that chat supports that function
 */

function isEnabledFor (feature, chatId) {return (this.features[chatId] && this.features[chatId][feature]) || this.features[0][feature]; }


module.exports = {
	features: config(false),
	isEnabledFor: isEnabledFor,
	groupIDs: [-1001214086516,-1001262375149,-1001155863433,-1001249368906,-1001387811266,-1001172707925,-1001386498425,-1001205439751,-1001337509181,-1001259839523,-1001289702550,-1001255281308,-1001171982049,-1001203933567,-1001313951685,-1001157259051,-1001290861768,-1001378858456,-1001288012396,-1001485242696,-1001370286549,-1001394632264,-1001286595347,-1001396035324,-1001177806644],
	excelMessage
};
