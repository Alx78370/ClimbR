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

    socket.on("newBloc", ({ to, bloc }) => {
      console.log(`🧱 Nouveau bloc envoyé à ${to}`);
      io.to(to).emit("newBloc", bloc);
    });

    socket.on("likeBloc", ({ blocId, action, userId, userData }) => {
      io.emit("likeBloc", { blocId, action, userId, userData });
    });

    socket.on("commentBloc", ({ blocId, comment }) => {
      io.emit("commentBloc", { blocId, comment });
    });

    socket.on("deleteComment", ({ blocId, commentId }) => {
      console.log(`🗑️ Suppression commentaire ${commentId} sur bloc ${blocId}`);
      io.emit("deleteComment", { blocId, commentId });
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
