// Handlers throw this to make grammY reject the call with a GrammyError, like Telegram does
export class BadRequest extends Error {
  constructor(reason: string) {
    super(`Bad Request: ${reason}`);
  }
}
