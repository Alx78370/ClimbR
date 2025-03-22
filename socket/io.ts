import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket } from "socket.io";

let io: Server;

export const initSocketIO = (server: HTTPServer): Server => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Nouveau client connecté : ${socket.id}`);

    socket.on("join", (userId: number) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} a rejoint la room user_${userId}`);
    });

    socket.on("newNotification", ({ to, data }) => {
      console.log(`📢 Reçu newNotification à envoyer à ${to}`);
      io.to(to).emit("newNotification", data);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Déconnexion : ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io non initialisé !");
  }
  return io;
};
