const fs = require('fs');
const sharp = require('sharp');
const config = require(__dirname + '/../token.js');
var request = require('request');

exports.execute = (bot, msg, match) => {
	if (msg.reply_to_message !== undefined){
		const allowedMimeTypes = ['image/jpeg', 'image/png'];
		if (msg.reply_to_message.photo !== undefined) {
			bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
			bot.deleteMessage(msg.chat.id, msg.message_id);
			bot.getFile(msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id).then((imagen) => {
				let path =  __dirname + '/../../ImageRotate/' + tokenGenerator(10) + '.png';
				let newPath = __dirname + '/../../ImageRotate/' + tokenGenerator(10) + '.png';
				let dest = fs.createWriteStream(path);

				request
					.get('https://api.telegram.org/file/bot' + config.token + '/' + imagen.file_path)
					.pipe(dest)
					.on('finish', () => {
						sharp(path)
							.rotate(match[1]==='izq'?90:-90, '#ffffff')
							.png({compressionLevel: 0})
							.toFile(newPath)
							.then(() => {
								if(msg.reply_to_message.caption)
									bot.sendPhoto(msg.chat.id, newPath, {caption: msg.reply_to_message.caption});
								else
									bot.sendPhoto(msg.chat.id, newPath);
							});
					});
			});
		}
		else if(allowedMimeTypes.includes(msg.reply_to_message.document.mime_type)) {
			bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
			bot.deleteMessage(msg.chat.id, msg.message_id);
			bot.getFile(msg.reply_to_message.document.file_id).then((imagen) => {
				let path =  __dirname + '/../../ImageRotate/' + tokenGenerator(10) + '.png';
				let newPath = __dirname + '/../../ImageRotate/' + tokenGenerator(10) + '.png';
				let dest = fs.createWriteStream(path);

				request
					.get('https://api.telegram.org/file/bot' + config.token + '/' + imagen.file_path)
					.pipe(dest)
					.on('finish', function () {
						sharp(path)
							.rotate(match[1]==='izq'?90:-90, '#ffffff')
							.png({compressionLevel: 0})
							.toFile(newPath)
							.then(() => {
								if(msg.reply_to_message.caption)
									bot.sendPhoto(msg.chat.id, newPath, {caption: msg.reply_to_message.caption});
								else
									bot.sendPhoto(msg.chat.id, newPath);
							});
					});
			});
		}
		else {
			bot.sendMessage(msg.chat.id, 'La imagen solicitada contiene una extensión que no esta soportada por este bot y/o no es una imagen.', {reply_to_message_id: msg.message_id});
		}
	}
};

function tokenGenerator(num) {
	var text = '';
	var possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for (var i = 0; i < num; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}