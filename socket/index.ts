import { createServer } from "http";
import { initSocketIO } from "./io";

const server = createServer();

initSocketIO(server);

server.listen(3001, () => {
  console.log("✅ Serveur Socket.IO en écoute sur http://localhost:3001");
});
