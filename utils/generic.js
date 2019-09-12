exports.generateMention = msg => {
	var fromName = msg.from.first_name + (msg.from.last_name != undefined ? ' ' + msg.from.last_name : '');
    
	return '[' + (msg.from.username != undefined ? '@' + msg.from.username : fromName) + '](tg://user?id=' + msg.from.id + ')';
};

exports.generateTimeInMiliseconds = (typeOfUnit, amount) => {
	var timeToSet = 0;
	var spanishTypeOfUnit = '';
	var isOneUnit = amount == 1;
	const days = 'd';
	const hours = 'h';
	const minutes = 'm';
	const seconds = 's';
	const weeks = 'w';

	switch(typeOfUnit)
	{
	case days:
		timeToSet = amount * 24 * 60 * 60;
		spanishTypeOfUnit = isOneUnit ? 'día' : 'días';
		break;
	case hours:
		timeToSet = amount * 60 * 60;            
		spanishTypeOfUnit = isOneUnit ? 'hora' : 'horas';      
		break;
	case minutes:
		timeToSet = amount * 60;
		spanishTypeOfUnit = isOneUnit ? 'minuto' : 'minutos';
		break;
	case seconds:
		timeToSet = amount;
		spanishTypeOfUnit = isOneUnit ? 'segundo' : 'segundos';
		break;
	case weeks:
		timeToSet = amount * 7 * 24 * 60 * 60;
		spanishTypeOfUnit = isOneUnit ? 'semana' : 'semanas';
		break;
	}

	return [timeToSet, spanishTypeOfUnit];
};

exports.logArray = array => {
	console.log(JSON.stringify(array), null, '\n');
};

/**
 * Obtiene la n posición del substring en el string, donde n es index.
 * @param { string } string El string en el que se va a buscar la posición.
 * @param { string } substring El substring que se va a buscar.
 * @param { number } index La posición que se va a buscar del substring en el string comenzando desde 1.
 */
exports.getPosition = (string, subString, index) => {
	return string.split(subString, index).join(subString).length;
};

exports.space = ' ';
exports.lineBreak = '\n';
exports.markDownParseMode = 'Markdown';
exports.statusKicked = 'kicked';
exports.statusLeft = 'left';
exports.statusCreator = 'creator';
exports.statusAdministrator = 'administrator';
exports.botUsername = 'frbaconsultas_bot';