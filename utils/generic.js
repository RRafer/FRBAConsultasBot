const logger = require('./logger');

exports.generateMention = (msg) => {
  const {username, first_name, last_name, id} = msg.from;
  const fromName = `${first_name}${last_name ? ` ${last_name}` : ''}`;
  return `[@${username||fromName}](tg://user?id=${id})`;
};

const getUserStatus = async (bot, msg, extraParams) => {
  const user = await bot.getChatMember(extraParams.chatID || msg.chat.id, extraParams.userID || msg.from.id);
  if (!user) return logger.error(`We were trying to get the user data for User ID ${extraParams.userID || msg.from.id} in chat ${extraParams.chatID || msg.chat.id}, but things happened and yeah, that's not going to happen today.`);
  return user.status;
};

exports.isAdmin = async (bot, msg, extraParams = {}) => ['creator', 'administrator'].includes(await getUserStatus(bot, msg, extraParams));