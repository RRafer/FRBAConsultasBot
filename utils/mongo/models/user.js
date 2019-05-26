let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: { type: Number },
    chatIds: { type: [Number] },
    privateChatId: { type: Number }
}, { versionKey: false });

let User = mongoose.model('Users', userSchema);

module.exports = User;