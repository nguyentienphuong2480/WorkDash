import { io } from "socket.io-client";

export const socket = io("https://workdash-1.onrender.com", {
  transports: ["websocket"],
});