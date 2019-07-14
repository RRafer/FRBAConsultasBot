const callbackObject = {
  action: '',
  params: [],
};

exports.validateUser = bot => (msg) => {
  if (msg.new_chat_members !== undefined) {
    msg.new_chat_members.forEach(() => {
      bot.emit('new_member', msg);
    });
  }
};

exports.verify = (msg) => {
  callbackObject.action = 'verificarbot';
  callbackObject.params.push(msg.from.id);
  callbackObject.params.push(msg.message_id);
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Haga clic aquí', callback_data: JSON.stringify(callbackObject) },
      ],
    ],
  };
  return (inlineKeyboard);
};

exports.RemPerms = {
  perms: {
    can_send_message: false,
    can_send_media_messages: false,
    can_send_other_messages: false,
    can_add_web_page_previews: false,
  },
};

exports.GivePerms = {
  perms: {
    can_send_message: true,
    can_send_media_messages: true,
    can_send_other_messages: true,
    can_add_web_page_previews: true,
  },
};
