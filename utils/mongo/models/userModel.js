let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
	userId: { type: Number, index: { unique: true } },
	userName: {type: String},
}, { versionKey: false });

let userModel = mongoose.model('User', userSchema);

module.exports = userModel;