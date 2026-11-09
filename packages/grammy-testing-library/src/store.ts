import type { Chat, Message, User, UserFromGetMe } from "@grammyjs/types";
import { BadRequest } from "./methods/bad-request.ts";

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
}

// Telegram's view of one bot: every chat it can reach, keyed by chat ID
export interface BotServer {
  chats: Map<number, ChatStore>;
  nextUserId: number;
  nextUpdateId: number;
  nextCallbackQueryId: number;
}

export function createBotServer(): BotServer {
  return {
    chats: new Map(),
    nextUserId: 1000,
    nextUpdateId: 1,
    nextCallbackQueryId: 1,
  };
}

export function createChat(server: BotServer): ChatStore {
  const user: User = {
    id: server.nextUserId++,
    is_bot: false,
    first_name: "Test User",
  };
  const store: ChatStore = {
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
  };
  server.chats.set(store.chat.id, store);
  return store;
}

export function findChat(
  server: BotServer,
  chatId: number | string,
): ChatStore {
  const store = server.chats.get(Number(chatId));
  if (!store) throw new BadRequest("chat not found");
  return store;
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
  messageStores.set(stored, store);
  return stored;
}

const messageStores = new WeakMap<object, ChatStore>();

export function getMessageStore(value: unknown): ChatStore | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  return messageStores.get(value);
}

export function getMessage(
  store: ChatStore,
  messageId: number,
  notFoundReason: string,
): Message {
  const message = store.messages.find((m) => m.message_id === messageId);
  if (!message) throw new BadRequest(notFoundReason);
  return message;
}
