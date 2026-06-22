import { AppError } from "../utils/errors.js";
export const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!result.success) {
        throw new AppError(400, result.error.issues.map((issue) => issue.message).join(", "), "VALIDATION_ERROR");
    }
    req.body = result.data.body ?? req.body;
    req.query = result.data.query ?? req.query;
    req.params = result.data.params ?? req.params;
    next();
};
