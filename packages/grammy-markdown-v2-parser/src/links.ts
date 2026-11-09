import type { MessageEntity } from "@grammyjs/types";

// Approximates tdlib's LinkManager helpers for MarkdownV2 link targets

const maxUserId = 2 ** 40 - 1;
const dateTimeFormat = /^(r|w?[dD]?[tT]?)$/;

function parseInt64(value: string): bigint | undefined {
  if (!/^-?\d+$/.test(value)) return undefined;
  const parsed = BigInt(value);
  return parsed >= -(2n ** 63n) && parsed < 2n ** 63n ? parsed : undefined;
}

function getTgLinkParameters(
  url: string,
  host: string,
): Map<string, string> | undefined {
  if (url.slice(0, 3).toLowerCase() !== "tg:") return undefined;
  let rest = url.slice(3);
  if (rest.startsWith("//")) rest = rest.slice(2);
  if (rest.slice(0, host.length).toLowerCase() !== host) return undefined;
  rest = rest.slice(host.length);
  if (rest.startsWith("/")) rest = rest.slice(1);
  if (!rest.startsWith("?")) return undefined;

  const parameters = new Map<string, string>();
  for (const parameter of rest.slice(1).split("#")[0].split("&")) {
    const separator = parameter.indexOf("=");
    const key = (
      separator === -1 ? parameter : parameter.slice(0, separator)
    ).toLowerCase();
    if (!parameters.has(key)) {
      parameters.set(
        key,
        separator === -1 ? "" : parameter.slice(separator + 1),
      );
    }
  }
  return parameters;
}

export function getLinkUserId(url: string): number | undefined {
  const id = parseInt64(getTgLinkParameters(url, "user")?.get("id") ?? "");
  if (id === undefined || id <= 0n || id > BigInt(maxUserId)) return undefined;
  return Number(id);
}

export function getLinkCustomEmojiId(url: string): string | undefined {
  return parseInt64(
    getTgLinkParameters(url, "emoji")?.get("id") ?? "",
  )?.toString();
}

export function getLinkDateTime(
  url: string,
):
  | Omit<MessageEntity.DateTimeMessageEntity, "type" | "offset" | "length">
  | undefined {
  const parameters = getTgLinkParameters(url, "time");
  const unixTime = parseInt64(parameters?.get("unix") ?? "");
  const format = parameters?.get("format") ?? "";
  if (unixTime === undefined || unixTime <= 0n || unixTime >= 2n ** 31n) {
    return undefined;
  }
  if (!dateTimeFormat.test(format)) return undefined;
  return {
    unix_time: Number(unixTime),
    date_time_format:
      format as MessageEntity.DateTimeMessageEntity["date_time_format"],
  };
}

export function getCheckedLink(url: string): string | undefined {
  const tgScheme = /^(tg|ton):(\/\/)?/i.exec(url);
  if (tgScheme) {
    const rest = url.slice(tgScheme[0].length);
    const hostEnd = rest.search(/[/?#]/);
    const host = hostEnd === -1 ? rest : rest.slice(0, hostEnd);
    if (!/^[A-Za-z0-9_-]+$/.test(host)) return undefined;
    let query = hostEnd === -1 ? "/" : rest.slice(hostEnd);
    if (!query.startsWith("/")) query = `/${query}`;
    if (query.startsWith("/?")) query = query.slice(1);
    return `${tgScheme[1].toLowerCase()}://${host.toLowerCase()}${query}`;
  }

  const withProtocol = /^[A-Za-z][A-Za-z0-9+.-]*:\/\//.test(url)
    ? url
    : `http://${url}`;
  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return undefined;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return undefined;
  }
  if (parsed.username || parsed.password) return undefined;
  if (!parsed.hostname.includes(".") && !parsed.hostname.startsWith("[")) {
    return undefined;
  }
  return parsed.href;
}
