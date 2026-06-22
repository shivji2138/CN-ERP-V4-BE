export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code = "APP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}
