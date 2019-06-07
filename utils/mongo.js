const users = require('./mongo/users');
const errors = require('./mongo/errors');

exports.setStartedUser = (userId, chatId) => users.setStartedUser(userId).catch(err => errors.logError(err, chatId));
exports.insertChatId = (userId, chatId) => users.insertChatId(userId, chatId).catch(err => errors.logError(err, chatId));
exports.getPrivateChatId = (userId, chatId) => users.getPrivateChatId(userId).catch(err => errors.logError(err, chatId));
exports.hasStarted = (userId, chatId) => users.hasStarted(userId).catch(err => errors.logError(err, chatId));
exports.getGroupIds = (userId, chatId) => users.getGroupIds(userId).catch(err => errors.logError(err, chatId));
exports.logError = (error, chatId) => errors.logError(error, chatId);
