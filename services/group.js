const GroupModel = require('../models/group');
const logger = require('../utils/logger');

let GroupService = {};

GroupService.loadGroupFromDB = async function () {
  let Group;
  try{
    Group = await GroupModel.find({}, null, {lean: true}); 
  } catch(err) {
    logger.error(`Can't find user: ${err}`);
  }
  // Technically, lean SHOULD return an object not a document already... but...
  return await Group;
};

GroupService.getGroupsIDs = async function () {
  let groups;
  try{
    groups = await GroupModel.find({}, 'groupId', {lean: true}); 
  } catch(err) {
    logger.error(`Can't get groups: ${err}`);
  }
  // Technically, lean SHOULD return an object not a document already... but...
  return await groups;
};

GroupService.saveGroup = async function (msg) {
  try {
    await GroupModel.updateOne({groupId: msg.chat.id}, {groupId: msg.chat.id}, { upsert: true, strict: false , setDefaultsOnInsert: true});
  } catch (err) {
    logger.error(`Can't create group: ${err}`);
  }
};

GroupService.saveGroupFromFile = async function (groups) {
  Object.values(groups).forEach(async (group) => {
    try {
      await GroupModel.updateOne({groupId: group.groupID}, {label: group.label, link: group.link}, { upsert: true, strict: false , setDefaultsOnInsert: true});
    } catch (err) {
      logger.error(`Can't create group: ${err}`);
    }
  });
};

module.exports = GroupService;