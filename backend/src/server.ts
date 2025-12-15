import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { connectDB } from "./config/db";

import { setupSocket } from "./sockets";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// 🔌 Setup sockets
setupSocket(io);

// make io accessible everywhere
export { io };

if (require.main === module) {
  connectDB().then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}
