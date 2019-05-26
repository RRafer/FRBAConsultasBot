const users = require('./mongo/users');
const errors = require('./mongo/errors');

exports.insertPrivateChat = (userId, privateChatId) => users.insertPrivateChat(userId, privateChatId);
exports.insertChatId = (userId, chatId) => users.insertChatId(userId, chatId);
exports.getPrivateChatId = userId => users.getPrivateChatId(userId);
exports.hasStarted = userId => users.hasStarted(userId);
exports.getGroupIds = userId => users.getGroupIds(userId);
exports.logError = (userId, chatId) => errors.logError(userId, chatId);
