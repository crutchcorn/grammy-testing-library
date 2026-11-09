import type { Chat, Message, User, UserFromGetMe } from "@grammyjs/types";

export const botInfo: UserFromGetMe = {
  id: 1,
  is_bot: true,
  first_name: "Test Bot",
  username: "test_bot",
  can_join_groups: true,
  can_read_all_group_messages: false,
  supports_inline_queries: false,
  can_connect_to_business: false,
  has_main_web_app: false,
  has_topics_enabled: false,
  allows_users_to_create_topics: false,
  can_manage_bots: false,
  supports_join_request_queries: false,
};

export interface ChatStore {
  bot: User;
  user: User;
  chat: Chat.PrivateChat;
  messages: Message[];
  nextMessageId: number;
  nextUpdateId: number;
}

export function createChatStore(): ChatStore {
  const user: User = { id: 2, is_bot: false, first_name: "Test User" };
  return {
    bot: {
      id: botInfo.id,
      is_bot: true,
      first_name: botInfo.first_name,
      username: botInfo.username,
    },
    user,
    // Telegram uses the user's ID as the ID of their private chat with a bot
    chat: { id: user.id, type: "private", first_name: user.first_name },
    messages: [],
    nextMessageId: 1,
    nextUpdateId: 1,
  };
}

export function addMessage(
  store: ChatStore,
  message: Omit<Message.TextMessage, "message_id" | "date" | "chat"> & {
    from: User;
  },
): Message.TextMessage & { chat: Chat.PrivateChat; from: User } {
  const stored = {
    ...message,
    message_id: store.nextMessageId++,
    date: Math.floor(Date.now() / 1000),
    chat: store.chat,
  };
  store.messages.push(stored);
  return stored;
}
