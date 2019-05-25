exports.generateMention = msg => {
    var fromUsername = msg.from.username;
    var fromName = msg.from.first_name + (msg.from.last_name != undefined ? ' ' + msg.from.last_name : '');
    var userId = msg.from.id;
    
    return '[' + (fromUsername != undefined ? '@' + fromUsername : fromName) + '](tg://user?id=' + userId + ')'
}
exports.space = ' ';
exports.lineBreak = '\n';
exports.markDownParseMode = 'Markdown';
exports.statusKick = 'kick';
exports.statusLeft = 'left';
exports.statusCreator = 'creator';
exports.statusAdministrator = 'administrator';
exports.botUsername = 'frbaconsultas_bot';