const users = require('./mongo/users');

exports.insertPrivateChat = (userId, privateChatId) => users.insertPrivateChat(userId, privateChatId);
exports.insertChatId = (userId, chatId) => users.insertChatId(userId, chatId);
exports.getPrivateChatId = userId => users.getPrivateChatId(userId);
exports.hasStarted = userId => users.hasStarted(userId);
exports.getGroupIds = userId => getGroupIds(userId);
