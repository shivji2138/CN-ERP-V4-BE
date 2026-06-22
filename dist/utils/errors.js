export class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code = "APP_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
export function toError(error) {
    return error instanceof Error ? error : new Error(String(error));
}
