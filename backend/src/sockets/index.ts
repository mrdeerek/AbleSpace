import { Server } from "socket.io";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const setupSocket = (io: Server) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    console.log("🔌 User connected:", userId);

    // Join personal room
    socket.join(userId);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", userId);
    });
  });
};
