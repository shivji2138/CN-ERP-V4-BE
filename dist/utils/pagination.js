export async function paginate(model, filter, query, projection) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        model.find(filter, projection).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        model.countDocuments(filter)
    ]);
    return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}
