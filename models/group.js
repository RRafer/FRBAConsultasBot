let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupSchema = new Schema({
  groupId: { type: Number, index: { unique: true } },
  label: {type: String, default: ''},
  link: {type: String, default: ''},
  enableDeleteSystemMessages: {type: Boolean , default: false},
  enableLinks: {type: Boolean, default: false},
  enableValidateUsers: {type: Boolean, default: false},
  enableRotate: {type: Boolean, default: false},
  enableGoogle: {type: Boolean, default: false},
  enableNuke: {type: Boolean, default: false},
  enableExcel: {type: Boolean, default: false},
}, { versionKey: false });

let groupModel = mongoose.model('group', groupSchema);

module.exports = groupModel;