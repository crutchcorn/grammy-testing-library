import { ApiMethods, Opts } from "@grammyjs/types";

export type Returns<F> = {
  [M in keyof ApiMethods<F>]: ReturnType<ApiMethods<F>[M]>;
};

export type MethodMap = {
  [K in keyof ApiMethods<unknown>]: ApiMethods<unknown>[K];
};

// Used to ensure that all methods in the map are implemented
const _methodMap: MethodMap = {
  getUpdates: getUpdates,
  setWebhook: setWebhook,
  deleteWebhook: deleteWebhook,
  getWebhookInfo: getWebhookInfo,
  getMe: getMe,
  logOut: logOut,
  close: close,
  sendMessage: sendMessage,
  forwardMessage: forwardMessage,
  forwardMessages: forwardMessages,
  copyMessage: copyMessage,
  copyMessages: copyMessages,
  sendPhoto: sendPhoto,
  sendAudio: sendAudio,
  sendDocument: sendDocument,
  sendVideo: sendVideo,
  sendAnimation: sendAnimation,
  sendVoice: sendVoice,
  sendVideoNote: sendVideoNote,
  sendMediaGroup: sendMediaGroup,
  sendLocation: sendLocation,
  editMessageLiveLocation: editMessageLiveLocation,
  stopMessageLiveLocation: stopMessageLiveLocation,
  sendPaidMedia: sendPaidMedia,
  sendVenue: sendVenue,
  sendContact: sendContact,
  sendPoll: sendPoll,
  sendDice: sendDice,
  sendChatAction: sendChatAction,
  setMessageReaction: setMessageReaction,
  getUserProfilePhotos: getUserProfilePhotos,
  setUserEmojiStatus: setUserEmojiStatus,
  getFile: getFile,
  kickChatMember: kickChatMember,
  banChatMember: banChatMember,
  unbanChatMember: unbanChatMember,
  restrictChatMember: restrictChatMember,
  promoteChatMember: promoteChatMember,
  setChatAdministratorCustomTitle: setChatAdministratorCustomTitle,
  banChatSenderChat: banChatSenderChat,
  unbanChatSenderChat: unbanChatSenderChat,
  setChatPermissions: setChatPermissions,
  exportChatInviteLink: exportChatInviteLink,
  createChatInviteLink: createChatInviteLink,
  editChatInviteLink: editChatInviteLink,
  createChatSubscriptionInviteLink: createChatSubscriptionInviteLink,
  editChatSubscriptionInviteLink: editChatSubscriptionInviteLink,
  revokeChatInviteLink: revokeChatInviteLink,
  approveChatJoinRequest: approveChatJoinRequest,
  declineChatJoinRequest: declineChatJoinRequest,
  setChatPhoto: setChatPhoto,
  deleteChatPhoto: deleteChatPhoto,
  setChatTitle: setChatTitle,
  setChatDescription: setChatDescription,
  pinChatMessage: pinChatMessage,
  unpinChatMessage: unpinChatMessage,
  unpinAllChatMessages: unpinAllChatMessages,
  leaveChat: leaveChat,
  getChat: getChat,
  getChatAdministrators: getChatAdministrators,
  getChatMembersCount: getChatMembersCount,
  getChatMemberCount: getChatMemberCount,
  getChatMember: getChatMember,
  setChatStickerSet: setChatStickerSet,
  deleteChatStickerSet: deleteChatStickerSet,
  getForumTopicIconStickers: getForumTopicIconStickers,
  createForumTopic: createForumTopic,
  editForumTopic: editForumTopic,
  closeForumTopic: closeForumTopic,
  reopenForumTopic: reopenForumTopic,
  deleteForumTopic: deleteForumTopic,
  unpinAllForumTopicMessages: unpinAllForumTopicMessages,
  editGeneralForumTopic: editGeneralForumTopic,
  closeGeneralForumTopic: closeGeneralForumTopic,
  reopenGeneralForumTopic: reopenGeneralForumTopic,
  hideGeneralForumTopic: hideGeneralForumTopic,
  unhideGeneralForumTopic: unhideGeneralForumTopic,
  unpinAllGeneralForumTopicMessages: unpinAllGeneralForumTopicMessages,
  answerCallbackQuery: answerCallbackQuery,
  getUserChatBoosts: getUserChatBoosts,
  getBusinessConnection: getBusinessConnection,
  setMyCommands: setMyCommands,
  deleteMyCommands: deleteMyCommands,
  getMyCommands: getMyCommands,
  setMyName: setMyName,
  getMyName: getMyName,
  setMyDescription: setMyDescription,
  getMyDescription: getMyDescription,
  setMyShortDescription: setMyShortDescription,
  getMyShortDescription: getMyShortDescription,
  setChatMenuButton: setChatMenuButton,
  getChatMenuButton: getChatMenuButton,
  setMyDefaultAdministratorRights: setMyDefaultAdministratorRights,
  getMyDefaultAdministratorRights: getMyDefaultAdministratorRights,
  editMessageText: editMessageText,
  editMessageCaption: editMessageCaption,
  editMessageMedia: editMessageMedia,
  editMessageReplyMarkup: editMessageReplyMarkup,
  stopPoll: stopPoll,
  deleteMessage: deleteMessage,
  deleteMessages: deleteMessages,
  deleteBusinessMessages: deleteBusinessMessages,
  setBusinessAccountName: setBusinessAccountName,
  setBusinessAccountUsername: setBusinessAccountUsername,
  setBusinessAccountBio: setBusinessAccountBio,
  setBusinessAccountProfilePhoto: setBusinessAccountProfilePhoto,
  removeBusinessAccountProfilePhoto: removeBusinessAccountProfilePhoto,
  setBusinessAccountGiftSettings: setBusinessAccountGiftSettings,
  getBusinessAccountStarBalance: getBusinessAccountStarBalance,
  transferBusinessAccountStars: transferBusinessAccountStars,
  getBusinessAccountGifts: getBusinessAccountGifts,
  convertGiftToStars: convertGiftToStars,
  upgradeGift: upgradeGift,
  transferGift: transferGift,
  postStory: postStory,
  editStory: editStory,
  deleteStory: deleteStory,
  sendSticker: sendSticker,
  getStickerSet: getStickerSet,
  getCustomEmojiStickers: getCustomEmojiStickers,
  uploadStickerFile: uploadStickerFile,
  createNewStickerSet: createNewStickerSet,
  addStickerToSet: addStickerToSet,
  setStickerPositionInSet: setStickerPositionInSet,
  deleteStickerFromSet: deleteStickerFromSet,
  replaceStickerInSet: replaceStickerInSet,
  setStickerEmojiList: setStickerEmojiList,
  setStickerKeywords: setStickerKeywords,
  setStickerMaskPosition: setStickerMaskPosition,
  setStickerSetTitle: setStickerSetTitle,
  deleteStickerSet: deleteStickerSet,
  setStickerSetThumbnail: setStickerSetThumbnail,
  setCustomEmojiStickerSetThumbnail: setCustomEmojiStickerSetThumbnail,
  getAvailableGifts: getAvailableGifts,
  sendGift: sendGift,
  giftPremiumSubscription: giftPremiumSubscription,
  answerInlineQuery: answerInlineQuery,
  answerWebAppQuery: answerWebAppQuery,
  savePreparedInlineMessage: savePreparedInlineMessage,
  sendInvoice: sendInvoice,
  createInvoiceLink: createInvoiceLink,
  answerShippingQuery: answerShippingQuery,
  answerPreCheckoutQuery: answerPreCheckoutQuery,
  getStarTransactions: getStarTransactions,
  refundStarPayment: refundStarPayment,
  editUserStarSubscription: editUserStarSubscription,
  verifyUser: verifyUser,
  verifyChat: verifyChat,
  removeUserVerification: removeUserVerification,
  removeChatVerification: removeChatVerification,
  readBusinessMessage: readBusinessMessage,
  setPassportDataErrors: setPassportDataErrors,
  sendGame: sendGame,
  setGameScore: setGameScore,
  getGameHighScores: getGameHighScores,
  sendRichMessage: sendRichMessage,
  sendLivePhoto: sendLivePhoto,
  sendChecklist: sendChecklist,
  editMessageChecklist: editMessageChecklist,
  sendMessageDraft: sendMessageDraft,
  sendRichMessageDraft: sendRichMessageDraft,
  getUserProfileAudios: getUserProfileAudios,
  setChatMemberTag: setChatMemberTag,
  answerChatJoinRequestQuery: answerChatJoinRequestQuery,
  sendChatJoinRequestWebApp: sendChatJoinRequestWebApp,
  approveSuggestedPost: approveSuggestedPost,
  declineSuggestedPost: declineSuggestedPost,
  getUserPersonalChatMessages: getUserPersonalChatMessages,
  answerGuestQuery: answerGuestQuery,
  getUserGifts: getUserGifts,
  getChatGifts: getChatGifts,
  getManagedBotToken: getManagedBotToken,
  replaceManagedBotToken: replaceManagedBotToken,
  getManagedBotAccessSettings: getManagedBotAccessSettings,
  setManagedBotAccessSettings: setManagedBotAccessSettings,
  setMyProfilePhoto: setMyProfilePhoto,
  removeMyProfilePhoto: removeMyProfilePhoto,
  getMyStarBalance: getMyStarBalance,
  editEphemeralMessageText: editEphemeralMessageText,
  editEphemeralMessageMedia: editEphemeralMessageMedia,
  editEphemeralMessageCaption: editEphemeralMessageCaption,
  editEphemeralMessageReplyMarkup: editEphemeralMessageReplyMarkup,
  deleteEphemeralMessage: deleteEphemeralMessage,
  deleteMessageReaction: deleteMessageReaction,
  deleteAllMessageReactions: deleteAllMessageReactions,
  repostStory: repostStory,
  savePreparedKeyboardButton: savePreparedKeyboardButton,
};

export function getUpdates(
  _props: Opts<unknown>["getUpdates"],
): Returns<unknown>["getUpdates"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setWebhook(
  _props: Opts<unknown>["setWebhook"],
): Returns<unknown>["setWebhook"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteWebhook(
  _props: Opts<unknown>["deleteWebhook"],
): Returns<unknown>["deleteWebhook"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getWebhookInfo(): Returns<unknown>["getWebhookInfo"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getMe(): Returns<unknown>["getMe"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function logOut(): Returns<unknown>["logOut"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function close(): Returns<unknown>["close"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendMessage(
  _props: Opts<unknown>["sendMessage"],
): Returns<unknown>["sendMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function forwardMessage(
  _props: Opts<unknown>["forwardMessage"],
): Returns<unknown>["forwardMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function forwardMessages(
  _props: Opts<unknown>["forwardMessages"],
): Returns<unknown>["forwardMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function copyMessage(
  _props: Opts<unknown>["copyMessage"],
): Returns<unknown>["copyMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function copyMessages(
  _props: Opts<unknown>["copyMessages"],
): Returns<unknown>["copyMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendPhoto(
  _props: Opts<unknown>["sendPhoto"],
): Returns<unknown>["sendPhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendAudio(
  _props: Opts<unknown>["sendAudio"],
): Returns<unknown>["sendAudio"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendDocument(
  _props: Opts<unknown>["sendDocument"],
): Returns<unknown>["sendDocument"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendVideo(
  _props: Opts<unknown>["sendVideo"],
): Returns<unknown>["sendVideo"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendAnimation(
  _props: Opts<unknown>["sendAnimation"],
): Returns<unknown>["sendAnimation"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendVoice(
  _props: Opts<unknown>["sendVoice"],
): Returns<unknown>["sendVoice"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendVideoNote(
  _props: Opts<unknown>["sendVideoNote"],
): Returns<unknown>["sendVideoNote"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendMediaGroup(
  _props: Opts<unknown>["sendMediaGroup"],
): Returns<unknown>["sendMediaGroup"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendLocation(
  _props: Opts<unknown>["sendLocation"],
): Returns<unknown>["sendLocation"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editMessageLiveLocation(
  _props: Opts<unknown>["editMessageLiveLocation"],
): Returns<unknown>["editMessageLiveLocation"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function stopMessageLiveLocation(
  _props: Opts<unknown>["stopMessageLiveLocation"],
): Returns<unknown>["stopMessageLiveLocation"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendPaidMedia(
  _props: Opts<unknown>["sendPaidMedia"],
): Returns<unknown>["sendPaidMedia"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendVenue(
  _props: Opts<unknown>["sendVenue"],
): Returns<unknown>["sendVenue"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendContact(
  _props: Opts<unknown>["sendContact"],
): Returns<unknown>["sendContact"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendPoll(
  _props: Opts<unknown>["sendPoll"],
): Returns<unknown>["sendPoll"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendDice(
  _props: Opts<unknown>["sendDice"],
): Returns<unknown>["sendDice"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendChatAction(
  _props: Opts<unknown>["sendChatAction"],
): Returns<unknown>["sendChatAction"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setMessageReaction(
  _props: Opts<unknown>["setMessageReaction"],
): Returns<unknown>["setMessageReaction"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getUserProfilePhotos(
  _props: Opts<unknown>["getUserProfilePhotos"],
): Returns<unknown>["getUserProfilePhotos"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setUserEmojiStatus(
  _props: Opts<unknown>["setUserEmojiStatus"],
): Returns<unknown>["setUserEmojiStatus"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getFile(
  _props: Opts<unknown>["getFile"],
): Returns<unknown>["getFile"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function kickChatMember(
  _props: Opts<unknown>["kickChatMember"],
): Returns<unknown>["kickChatMember"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function banChatMember(
  _props: Opts<unknown>["banChatMember"],
): Returns<unknown>["banChatMember"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function unbanChatMember(
  _props: Opts<unknown>["unbanChatMember"],
): Returns<unknown>["unbanChatMember"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function restrictChatMember(
  _props: Opts<unknown>["restrictChatMember"],
): Returns<unknown>["restrictChatMember"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function promoteChatMember(
  _props: Opts<unknown>["promoteChatMember"],
): Returns<unknown>["promoteChatMember"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatAdministratorCustomTitle(
  _props: Opts<unknown>["setChatAdministratorCustomTitle"],
): Returns<unknown>["setChatAdministratorCustomTitle"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function banChatSenderChat(
  _props: Opts<unknown>["banChatSenderChat"],
): Returns<unknown>["banChatSenderChat"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function unbanChatSenderChat(
  _props: Opts<unknown>["unbanChatSenderChat"],
): Returns<unknown>["unbanChatSenderChat"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatPermissions(
  _props: Opts<unknown>["setChatPermissions"],
): Returns<unknown>["setChatPermissions"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function exportChatInviteLink(
  _props: Opts<unknown>["exportChatInviteLink"],
): Returns<unknown>["exportChatInviteLink"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function createChatInviteLink(
  _props: Opts<unknown>["createChatInviteLink"],
): Returns<unknown>["createChatInviteLink"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editChatInviteLink(
  _props: Opts<unknown>["editChatInviteLink"],
): Returns<unknown>["editChatInviteLink"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function createChatSubscriptionInviteLink(
  _props: Opts<unknown>["createChatSubscriptionInviteLink"],
): Returns<unknown>["createChatSubscriptionInviteLink"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editChatSubscriptionInviteLink(
  _props: Opts<unknown>["editChatSubscriptionInviteLink"],
): Returns<unknown>["editChatSubscriptionInviteLink"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function revokeChatInviteLink(
  _props: Opts<unknown>["revokeChatInviteLink"],
): Returns<unknown>["revokeChatInviteLink"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function approveChatJoinRequest(
  _props: Opts<unknown>["approveChatJoinRequest"],
): Returns<unknown>["approveChatJoinRequest"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function declineChatJoinRequest(
  _props: Opts<unknown>["declineChatJoinRequest"],
): Returns<unknown>["declineChatJoinRequest"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatPhoto(
  _props: Opts<unknown>["setChatPhoto"],
): Returns<unknown>["setChatPhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteChatPhoto(
  _props: Opts<unknown>["deleteChatPhoto"],
): Returns<unknown>["deleteChatPhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatTitle(
  _props: Opts<unknown>["setChatTitle"],
): Returns<unknown>["setChatTitle"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatDescription(
  _props: Opts<unknown>["setChatDescription"],
): Returns<unknown>["setChatDescription"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function pinChatMessage(
  _props: Opts<unknown>["pinChatMessage"],
): Returns<unknown>["pinChatMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function unpinChatMessage(
  _props: Opts<unknown>["unpinChatMessage"],
): Returns<unknown>["unpinChatMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function unpinAllChatMessages(
  _props: Opts<unknown>["unpinAllChatMessages"],
): Returns<unknown>["unpinAllChatMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function leaveChat(
  _props: Opts<unknown>["leaveChat"],
): Returns<unknown>["leaveChat"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getChat(
  _props: Opts<unknown>["getChat"],
): Returns<unknown>["getChat"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getChatAdministrators(
  _props: Opts<unknown>["getChatAdministrators"],
): Returns<unknown>["getChatAdministrators"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getChatMembersCount(
  _props: Opts<unknown>["getChatMembersCount"],
): Returns<unknown>["getChatMembersCount"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getChatMemberCount(
  _props: Opts<unknown>["getChatMemberCount"],
): Returns<unknown>["getChatMemberCount"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getChatMember(
  _props: Opts<unknown>["getChatMember"],
): Returns<unknown>["getChatMember"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatStickerSet(
  _props: Opts<unknown>["setChatStickerSet"],
): Returns<unknown>["setChatStickerSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteChatStickerSet(
  _props: Opts<unknown>["deleteChatStickerSet"],
): Returns<unknown>["deleteChatStickerSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getForumTopicIconStickers(): Returns<unknown>["getForumTopicIconStickers"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function createForumTopic(
  _props: Opts<unknown>["createForumTopic"],
): Returns<unknown>["createForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editForumTopic(
  _props: Opts<unknown>["editForumTopic"],
): Returns<unknown>["editForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function closeForumTopic(
  _props: Opts<unknown>["closeForumTopic"],
): Returns<unknown>["closeForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function reopenForumTopic(
  _props: Opts<unknown>["reopenForumTopic"],
): Returns<unknown>["reopenForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteForumTopic(
  _props: Opts<unknown>["deleteForumTopic"],
): Returns<unknown>["deleteForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function unpinAllForumTopicMessages(
  _props: Opts<unknown>["unpinAllForumTopicMessages"],
): Returns<unknown>["unpinAllForumTopicMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editGeneralForumTopic(
  _props: Opts<unknown>["editGeneralForumTopic"],
): Returns<unknown>["editGeneralForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function closeGeneralForumTopic(
  _props: Opts<unknown>["closeGeneralForumTopic"],
): Returns<unknown>["closeGeneralForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function reopenGeneralForumTopic(
  _props: Opts<unknown>["reopenGeneralForumTopic"],
): Returns<unknown>["reopenGeneralForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function hideGeneralForumTopic(
  _props: Opts<unknown>["hideGeneralForumTopic"],
): Returns<unknown>["hideGeneralForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function unhideGeneralForumTopic(
  _props: Opts<unknown>["unhideGeneralForumTopic"],
): Returns<unknown>["unhideGeneralForumTopic"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function unpinAllGeneralForumTopicMessages(
  _props: Opts<unknown>["unpinAllGeneralForumTopicMessages"],
): Returns<unknown>["unpinAllGeneralForumTopicMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function answerCallbackQuery(
  _props: Opts<unknown>["answerCallbackQuery"],
): Returns<unknown>["answerCallbackQuery"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getUserChatBoosts(
  _props: Opts<unknown>["getUserChatBoosts"],
): Returns<unknown>["getUserChatBoosts"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getBusinessConnection(
  _props: Opts<unknown>["getBusinessConnection"],
): Returns<unknown>["getBusinessConnection"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setMyCommands(
  _props: Opts<unknown>["setMyCommands"],
): Returns<unknown>["setMyCommands"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteMyCommands(
  _props: Opts<unknown>["deleteMyCommands"],
): Returns<unknown>["deleteMyCommands"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getMyCommands(
  _props: Opts<unknown>["getMyCommands"],
): Returns<unknown>["getMyCommands"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setMyName(
  _props: Opts<unknown>["setMyName"],
): Returns<unknown>["setMyName"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getMyName(
  _props: Opts<unknown>["getMyName"],
): Returns<unknown>["getMyName"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setMyDescription(
  _props: Opts<unknown>["setMyDescription"],
): Returns<unknown>["setMyDescription"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getMyDescription(
  _props: Opts<unknown>["getMyDescription"],
): Returns<unknown>["getMyDescription"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setMyShortDescription(
  _props: Opts<unknown>["setMyShortDescription"],
): Returns<unknown>["setMyShortDescription"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getMyShortDescription(
  _props: Opts<unknown>["getMyShortDescription"],
): Returns<unknown>["getMyShortDescription"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatMenuButton(
  _props: Opts<unknown>["setChatMenuButton"],
): Returns<unknown>["setChatMenuButton"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getChatMenuButton(
  _props: Opts<unknown>["getChatMenuButton"],
): Returns<unknown>["getChatMenuButton"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setMyDefaultAdministratorRights(
  _props: Opts<unknown>["setMyDefaultAdministratorRights"],
): Returns<unknown>["setMyDefaultAdministratorRights"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getMyDefaultAdministratorRights(
  _props: Opts<unknown>["getMyDefaultAdministratorRights"],
): Returns<unknown>["getMyDefaultAdministratorRights"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editMessageText(
  _props: Opts<unknown>["editMessageText"],
): Returns<unknown>["editMessageText"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editMessageCaption(
  _props: Opts<unknown>["editMessageCaption"],
): Returns<unknown>["editMessageCaption"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editMessageMedia(
  _props: Opts<unknown>["editMessageMedia"],
): Returns<unknown>["editMessageMedia"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editMessageReplyMarkup(
  _props: Opts<unknown>["editMessageReplyMarkup"],
): Returns<unknown>["editMessageReplyMarkup"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function stopPoll(
  _props: Opts<unknown>["stopPoll"],
): Returns<unknown>["stopPoll"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteMessage(
  _props: Opts<unknown>["deleteMessage"],
): Returns<unknown>["deleteMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteMessages(
  _props: Opts<unknown>["deleteMessages"],
): Returns<unknown>["deleteMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteBusinessMessages(
  _props: Opts<unknown>["deleteBusinessMessages"],
): Returns<unknown>["deleteBusinessMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setBusinessAccountName(
  _props: Opts<unknown>["setBusinessAccountName"],
): Returns<unknown>["setBusinessAccountName"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setBusinessAccountUsername(
  _props: Opts<unknown>["setBusinessAccountUsername"],
): Returns<unknown>["setBusinessAccountUsername"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setBusinessAccountBio(
  _props: Opts<unknown>["setBusinessAccountBio"],
): Returns<unknown>["setBusinessAccountBio"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setBusinessAccountProfilePhoto(
  _props: Opts<unknown>["setBusinessAccountProfilePhoto"],
): Returns<unknown>["setBusinessAccountProfilePhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function removeBusinessAccountProfilePhoto(
  _props: Opts<unknown>["removeBusinessAccountProfilePhoto"],
): Returns<unknown>["removeBusinessAccountProfilePhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setBusinessAccountGiftSettings(
  _props: Opts<unknown>["setBusinessAccountGiftSettings"],
): Returns<unknown>["setBusinessAccountGiftSettings"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getBusinessAccountStarBalance(
  _props: Opts<unknown>["getBusinessAccountStarBalance"],
): Returns<unknown>["getBusinessAccountStarBalance"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function transferBusinessAccountStars(
  _props: Opts<unknown>["transferBusinessAccountStars"],
): Returns<unknown>["transferBusinessAccountStars"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getBusinessAccountGifts(
  _props: Opts<unknown>["getBusinessAccountGifts"],
): Returns<unknown>["getBusinessAccountGifts"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function convertGiftToStars(
  _props: Opts<unknown>["convertGiftToStars"],
): Returns<unknown>["convertGiftToStars"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function upgradeGift(
  _props: Opts<unknown>["upgradeGift"],
): Returns<unknown>["upgradeGift"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function transferGift(
  _props: Opts<unknown>["transferGift"],
): Returns<unknown>["transferGift"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function postStory(
  _props: Opts<unknown>["postStory"],
): Returns<unknown>["postStory"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editStory(
  _props: Opts<unknown>["editStory"],
): Returns<unknown>["editStory"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteStory(
  _props: Opts<unknown>["deleteStory"],
): Returns<unknown>["deleteStory"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendSticker(
  _props: Opts<unknown>["sendSticker"],
): Returns<unknown>["sendSticker"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getStickerSet(
  _props: Opts<unknown>["getStickerSet"],
): Returns<unknown>["getStickerSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getCustomEmojiStickers(
  _props: Opts<unknown>["getCustomEmojiStickers"],
): Returns<unknown>["getCustomEmojiStickers"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function uploadStickerFile(
  _props: Opts<unknown>["uploadStickerFile"],
): Returns<unknown>["uploadStickerFile"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function createNewStickerSet(
  _props: Opts<unknown>["createNewStickerSet"],
): Returns<unknown>["createNewStickerSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function addStickerToSet(
  _props: Opts<unknown>["addStickerToSet"],
): Returns<unknown>["addStickerToSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setStickerPositionInSet(
  _props: Opts<unknown>["setStickerPositionInSet"],
): Returns<unknown>["setStickerPositionInSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteStickerFromSet(
  _props: Opts<unknown>["deleteStickerFromSet"],
): Returns<unknown>["deleteStickerFromSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function replaceStickerInSet(
  _props: Opts<unknown>["replaceStickerInSet"],
): Returns<unknown>["replaceStickerInSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setStickerEmojiList(
  _props: Opts<unknown>["setStickerEmojiList"],
): Returns<unknown>["setStickerEmojiList"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setStickerKeywords(
  _props: Opts<unknown>["setStickerKeywords"],
): Returns<unknown>["setStickerKeywords"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setStickerMaskPosition(
  _props: Opts<unknown>["setStickerMaskPosition"],
): Returns<unknown>["setStickerMaskPosition"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setStickerSetTitle(
  _props: Opts<unknown>["setStickerSetTitle"],
): Returns<unknown>["setStickerSetTitle"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteStickerSet(
  _props: Opts<unknown>["deleteStickerSet"],
): Returns<unknown>["deleteStickerSet"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setStickerSetThumbnail(
  _props: Opts<unknown>["setStickerSetThumbnail"],
): Returns<unknown>["setStickerSetThumbnail"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setCustomEmojiStickerSetThumbnail(
  _props: Opts<unknown>["setCustomEmojiStickerSetThumbnail"],
): Returns<unknown>["setCustomEmojiStickerSetThumbnail"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getAvailableGifts(): Returns<unknown>["getAvailableGifts"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendGift(
  _props: Opts<unknown>["sendGift"],
): Returns<unknown>["sendGift"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function giftPremiumSubscription(
  _props: Opts<unknown>["giftPremiumSubscription"],
): Returns<unknown>["giftPremiumSubscription"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function answerInlineQuery(
  _props: Opts<unknown>["answerInlineQuery"],
): Returns<unknown>["answerInlineQuery"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function answerWebAppQuery(
  _props: Opts<unknown>["answerWebAppQuery"],
): Returns<unknown>["answerWebAppQuery"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function savePreparedInlineMessage(
  _props: Opts<unknown>["savePreparedInlineMessage"],
): Returns<unknown>["savePreparedInlineMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendInvoice(
  _props: Opts<unknown>["sendInvoice"],
): Returns<unknown>["sendInvoice"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function createInvoiceLink(
  _props: Opts<unknown>["createInvoiceLink"],
): Returns<unknown>["createInvoiceLink"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function answerShippingQuery(
  _props: Opts<unknown>["answerShippingQuery"],
): Returns<unknown>["answerShippingQuery"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function answerPreCheckoutQuery(
  _props: Opts<unknown>["answerPreCheckoutQuery"],
): Returns<unknown>["answerPreCheckoutQuery"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getStarTransactions(
  _props: Opts<unknown>["getStarTransactions"],
): Returns<unknown>["getStarTransactions"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function refundStarPayment(
  _props: Opts<unknown>["refundStarPayment"],
): Returns<unknown>["refundStarPayment"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editUserStarSubscription(
  _props: Opts<unknown>["editUserStarSubscription"],
): Returns<unknown>["editUserStarSubscription"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function verifyUser(
  _props: Opts<unknown>["verifyUser"],
): Returns<unknown>["verifyUser"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function verifyChat(
  _props: Opts<unknown>["verifyChat"],
): Returns<unknown>["verifyChat"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function removeUserVerification(
  _props: Opts<unknown>["removeUserVerification"],
): Returns<unknown>["removeUserVerification"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function removeChatVerification(
  _props: Opts<unknown>["removeChatVerification"],
): Returns<unknown>["removeChatVerification"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function readBusinessMessage(
  _props: Opts<unknown>["readBusinessMessage"],
): Returns<unknown>["readBusinessMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setPassportDataErrors(
  _props: Opts<unknown>["setPassportDataErrors"],
): Returns<unknown>["setPassportDataErrors"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendGame(
  _props: Opts<unknown>["sendGame"],
): Returns<unknown>["sendGame"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setGameScore(
  _props: Opts<unknown>["setGameScore"],
): Returns<unknown>["setGameScore"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getGameHighScores(
  _props: Opts<unknown>["getGameHighScores"],
): Returns<unknown>["getGameHighScores"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendRichMessage(
  _props: Opts<unknown>["sendRichMessage"],
): Returns<unknown>["sendRichMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendLivePhoto(
  _props: Opts<unknown>["sendLivePhoto"],
): Returns<unknown>["sendLivePhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendChecklist(
  _props: Opts<unknown>["sendChecklist"],
): Returns<unknown>["sendChecklist"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editMessageChecklist(
  _props: Opts<unknown>["editMessageChecklist"],
): Returns<unknown>["editMessageChecklist"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendMessageDraft(
  _props: Opts<unknown>["sendMessageDraft"],
): Returns<unknown>["sendMessageDraft"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendRichMessageDraft(
  _props: Opts<unknown>["sendRichMessageDraft"],
): Returns<unknown>["sendRichMessageDraft"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getUserProfileAudios(
  _props: Opts<unknown>["getUserProfileAudios"],
): Returns<unknown>["getUserProfileAudios"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setChatMemberTag(
  _props: Opts<unknown>["setChatMemberTag"],
): Returns<unknown>["setChatMemberTag"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function answerChatJoinRequestQuery(
  _props: Opts<unknown>["answerChatJoinRequestQuery"],
): Returns<unknown>["answerChatJoinRequestQuery"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function sendChatJoinRequestWebApp(
  _props: Opts<unknown>["sendChatJoinRequestWebApp"],
): Returns<unknown>["sendChatJoinRequestWebApp"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function approveSuggestedPost(
  _props: Opts<unknown>["approveSuggestedPost"],
): Returns<unknown>["approveSuggestedPost"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function declineSuggestedPost(
  _props: Opts<unknown>["declineSuggestedPost"],
): Returns<unknown>["declineSuggestedPost"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getUserPersonalChatMessages(
  _props: Opts<unknown>["getUserPersonalChatMessages"],
): Returns<unknown>["getUserPersonalChatMessages"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function answerGuestQuery(
  _props: Opts<unknown>["answerGuestQuery"],
): Returns<unknown>["answerGuestQuery"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getUserGifts(
  _props: Opts<unknown>["getUserGifts"],
): Returns<unknown>["getUserGifts"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getChatGifts(
  _props: Opts<unknown>["getChatGifts"],
): Returns<unknown>["getChatGifts"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getManagedBotToken(
  _props: Opts<unknown>["getManagedBotToken"],
): Returns<unknown>["getManagedBotToken"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function replaceManagedBotToken(
  _props: Opts<unknown>["replaceManagedBotToken"],
): Returns<unknown>["replaceManagedBotToken"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getManagedBotAccessSettings(
  _props: Opts<unknown>["getManagedBotAccessSettings"],
): Returns<unknown>["getManagedBotAccessSettings"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setManagedBotAccessSettings(
  _props: Opts<unknown>["setManagedBotAccessSettings"],
): Returns<unknown>["setManagedBotAccessSettings"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function setMyProfilePhoto(
  _props: Opts<unknown>["setMyProfilePhoto"],
): Returns<unknown>["setMyProfilePhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function removeMyProfilePhoto(): Returns<unknown>["removeMyProfilePhoto"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function getMyStarBalance(): Returns<unknown>["getMyStarBalance"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editEphemeralMessageText(
  _props: Opts<unknown>["editEphemeralMessageText"],
): Returns<unknown>["editEphemeralMessageText"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editEphemeralMessageMedia(
  _props: Opts<unknown>["editEphemeralMessageMedia"],
): Returns<unknown>["editEphemeralMessageMedia"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editEphemeralMessageCaption(
  _props: Opts<unknown>["editEphemeralMessageCaption"],
): Returns<unknown>["editEphemeralMessageCaption"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function editEphemeralMessageReplyMarkup(
  _props: Opts<unknown>["editEphemeralMessageReplyMarkup"],
): Returns<unknown>["editEphemeralMessageReplyMarkup"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteEphemeralMessage(
  _props: Opts<unknown>["deleteEphemeralMessage"],
): Returns<unknown>["deleteEphemeralMessage"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteMessageReaction(
  _props: Opts<unknown>["deleteMessageReaction"],
): Returns<unknown>["deleteMessageReaction"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function deleteAllMessageReactions(
  _props: Opts<unknown>["deleteAllMessageReactions"],
): Returns<unknown>["deleteAllMessageReactions"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function repostStory(
  _props: Opts<unknown>["repostStory"],
): Returns<unknown>["repostStory"] {
  throw new Error("Not implemented");
  return 0 as never;
}
export function savePreparedKeyboardButton(
  _props: Opts<unknown>["savePreparedKeyboardButton"],
): Returns<unknown>["savePreparedKeyboardButton"] {
  throw new Error("Not implemented");
  return 0 as never;
}
