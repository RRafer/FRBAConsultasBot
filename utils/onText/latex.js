const fs = require('fs');
var crypto = require('crypto');


exports.execute = (bot, msg, match) => {
  const path = __dirname + '\\latex\\' + crypto.randomBytes(15).toString('hex') + '.png';
  // What is mathmode? Why i do not have it in package.json?
  // Are we still going to use this function?
  let render = require('mathmode')(match[1]).pipe(fs.createWriteStream(path));

  render.on('finish', () => {
    let formData = {photo: path};
    bot.sendPhoto(msg.chat.id, formData);
  });
};