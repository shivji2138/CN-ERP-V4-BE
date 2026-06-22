import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { connectRedis, redis } from "./config/redis.js";
import { createSocketServer } from "./config/socket.js";
async function bootstrap() {
    await connectDatabase();
    await connectRedis();
    const app = createApp();
    const server = http.createServer(app);
    createSocketServer(server);
    server.keepAliveTimeout = 65_000;
    server.headersTimeout = 66_000;
    server.listen(env.PORT, () => console.log(`Cybernaut ERP API running on :${env.PORT}`));
    const shutdown = async () => {
        console.log("Shutting down gracefully");
        server.close();
        await redis.quit();
        process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}
bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
});
