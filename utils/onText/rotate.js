const fs = require('fs');
const sharp = require('sharp');
const request = require('request');
const uuidv4 = require('uuid/v4');

exports.execute = (bot, msg, match) => {
	if (!msg.reply_to_message){
		bot.sendMessage(msg.chat.id, 'Debe responder a una imagen para poder utilizar este comando', {reply_to_message_id: msg.message_id});
		return;
	}

	const allowedMimeTypes = ['image/jpeg', 'image/png'];
	let file;
	if(msg.reply_to_message.photo)
		file = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id;
	else if(msg.reply_to_message.document && allowedMimeTypes.includes(msg.reply_to_message.document.mime_type)){
		file = msg.reply_to_message.document.file_id;
	}	
	else{
		bot.sendMessage(msg.chat.id, 'La imagen solicitada contiene una extensión que no esta soportada por este bot y/o no es una imagen.', {reply_to_message_id: msg.message_id});
		return;
	}
		
			
	bot.deleteMessage(msg.chat.id, msg.message_id);
	bot.getFile(file).then((imagen) => {
		let path =  `${__dirname}/../../ImageRotate/${uuidv4()}.png`;
		let newPath = `${__dirname}/../../ImageRotate/${uuidv4()}.png`;

		request
			.get(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${imagen.file_path}`)
			.pipe(fs.createWriteStream(path))	
			.on('finish', () =>{ 
				sharp(path)
					.rotate(match[1]==='izq'?90:-90, '#ffffff')
					.toFile(newPath)
					.then(() => {
						bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
						if(msg.reply_to_message.caption)
							bot.sendPhoto(msg.chat.id, newPath, {caption: msg.reply_to_message.caption});
						else
							bot.sendPhoto(msg.chat.id, newPath);
					});	
			});	
	});
};