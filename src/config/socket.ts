import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { allowedOrigins } from "./cors.js";
import { env } from "./env.js";
import { bindNotificationServer } from "../modules/notification/notification.service.js";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
    transports: ["websocket", "polling"]
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);
    socket.on("project:join", (projectId) => socket.join(`project:${projectId}`));
    socket.on("discussion:message", (payload) => io.to(`project:${payload.projectId}`).emit("discussion:message", payload));
  });

  bindNotificationServer(io);
  return io;
}
