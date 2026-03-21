/**
 * Интерфейс для сообщения из Telegram
 */
export interface TelegramMessage {
  message_id: number;
  date: number;
  text?: string;
  photo?: TelegramPhoto[];
  video?: TelegramVideo;
  views?: number;
}

export interface TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface TelegramVideo {
  file_id: string;
  file_unique_id: string;
  duration: number;
  width: number;
  height: number;
}

/**
 * Интерфейс для ответа от Telegram API
 */
export interface TelegramUpdate {
  ok: boolean;
  result?: TelegramUpdateResult[];
}

export interface TelegramUpdateResult {
  update_id: number;
  channel_post?: TelegramMessage;
}

/**
 * Интерфейс для настроенного сервиса Telegram
 */
export interface TelegramServiceConfig {
  botToken: string;
  channelId: string;
  baseUrl: string;
}
