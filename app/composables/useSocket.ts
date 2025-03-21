import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function useSocket(): Socket {
  if (!socket) {
    const newSocket = io("http://localhost:3001", {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connecté :", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.warn("❌ Socket déconnecté :", newSocket?.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("🚨 Erreur de connexion socket :", err.message);
    });

    socket = newSocket;
  }

  return socket;
}
