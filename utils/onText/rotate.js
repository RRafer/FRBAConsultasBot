const fs = require('fs');
const sharp = require('sharp');
const config = require(__dirname + '/../token.js');
const request = require('request');

// Descomentar las lineas de abajo para que el bot mande un mensaje cuando q

exports.execute = (bot, msg, match) => {
	if (msg.reply_to_message){
		const allowedMimeTypes = ['image/jpeg', 'image/png'];
		//let msgDelete;
		if (msg.reply_to_message.photo) {
			bot.deleteMessage(msg.chat.id, msg.message_id);
			/*bot.sendMessage(msg.chat.id, `La Imagen se esta rotando hacia la ${match[1]==='izq'?'izquierda':'derecha'}.\n\nAguarde unos instantes`, {reply_to_message_id: msg.reply_to_message.message_id}).then((rotando) => {
				msgDelete = rotando.message_id;
			});*/
			bot.getFile(msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id).then((imagen) => {
				let path =  `${__dirname}/../../ImageRotate/${tokenGenerator(10)}.png`;
				let newPath = `${__dirname}/../../ImageRotate/${tokenGenerator(10)}.png`;

				request
					.get(`https://api.telegram.org/file/bot${config.token}/${imagen.file_path}`)
					.pipe(fs.createWriteStream(path))
					.on('finish', () => {
						sharp(path)
							.rotate(match[1]==='izq'?90:-90, '#ffffff')
							//.png({compressionLevel: 0})
							.toFile(newPath)
							.then(() => {
								bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
								//bot.deleteMessage(msg.chat.id, msgDelete);
								if(msg.reply_to_message.caption)
									bot.sendPhoto(msg.chat.id, newPath, {caption: msg.reply_to_message.caption});
								else
									bot.sendPhoto(msg.chat.id, newPath);
							});
					});
			});
		}
		else if(allowedMimeTypes.includes(msg.reply_to_message.document.mime_type)) {
			bot.deleteMessage(msg.chat.id, msg.message_id);
			/*bot.sendMessage(msg.chat.id, `La Imagen se esta rotando hacia la ${match[1]==='izq'?'izquierda':'derecha'}.\n\nAguarde unos instantes`, {reply_to_message_id: msg.reply_to_message.message_id}).then((rotando) => {
				msgDelete = rotando.message_id;
			});*/
			bot.getFile(msg.reply_to_message.document.file_id).then((imagen) => {
				let path =  `${__dirname}/../../ImageRotate/${tokenGenerator(10)}.png`;
				let newPath = `${__dirname}/../../ImageRotate/${tokenGenerator(10)}.png`;

				request
					.get(`https://api.telegram.org/file/bot${config.token}/${imagen.file_path}`)
					.pipe(fs.createWriteStream(path))
					.on('finish', function () {
						sharp(path)
							.rotate(match[1]==='izq'?90:-90, '#ffffff')
							//.png({compressionLevel: 0})
							.toFile(newPath)
							.then(() => {
								bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
								//bot.deleteMessage(msg.chat.id, msgDelete);
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
	let text = '';
	let possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for (let i = 0; i < num; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}