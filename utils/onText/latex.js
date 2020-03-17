const fs = require('fs');

exports.execute = (bot, msg, match) => {
	var path = __dirname + '\\latex\\' + tokenGenerator(10) + '.png';
	console.log(path);
	var sentence = match[1];
	var render = require('mathmode')(sentence).pipe(fs.createWriteStream(path));

	render.on('finish', function () {
		var formData = {
			photo: path
		};
		bot.sendPhoto(msg.chat.id, formData);
	});

	function tokenGenerator(num){
		var text = '';
		var possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		for( var i=0; i < num; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
};