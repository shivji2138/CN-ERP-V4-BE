import type { Server } from "socket.io";
import { Notification } from "./notification.model.js";

let io: Server | undefined;

export function bindNotificationServer(server: Server) {
  io = server;
}

export async function notifyUser(userId: string, title: string, body: string, data?: unknown) {
  const notification = await Notification.create({ userId, title, body, data });
  io?.to(`user:${userId}`).emit("notification:new", notification);
  return notification;
}
