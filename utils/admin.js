
exports.validateUser = bot => (msg) => {

  const RemPerms = {
    perms: {
      can_send_message: false,
      can_send_media_messages: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
    },
  };

  if (msg.new_chat_members !== undefined) {
    msg.new_chat_members.forEach((user) => {
      bot.emit('new_member', user);
    });
  }
};

exports.verify = (msg) => {
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Haga clic aquí', callback_data: `verificarbot@${msg.from.id}@${msg.message_id}` },
      ],
    ],
  };
  return (inlineKeyboard);
};

exports.GivePerms = {
  perms: {
    can_send_message: true,
    can_send_media_messages: true,
    can_send_other_messages: true,
    can_add_web_page_previews: true,
  },
};
