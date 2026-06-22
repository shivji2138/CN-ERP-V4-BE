import { Notification } from "./notification.model.js";
let io;
export function bindNotificationServer(server) {
    io = server;
}
export async function notifyUser(userId, title, body, data) {
    const notification = await Notification.create({ userId, title, body, data });
    io?.to(`user:${userId}`).emit("notification:new", notification);
    return notification;
}
