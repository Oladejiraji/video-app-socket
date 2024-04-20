import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../constants/types";
import Users from "../../data/users";

export const onConnected = async (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  //! Add socket user to user array
  const token = socket.handshake.query.userId as string;
  if (!token) return;
  console.log(token, "connected");
  socket.emit("ttees");
  socket.join(token);
  const filt = Users.filter((el) => el.id === token);
  if (filt.length > 0) {
    Users.forEach((us) => {
      if (us.id === token) {
        us.online = true;
      }
    });
  } else {
    Users.push({ id: token, online: true, signal: null });
  }

  //! Disconnect socket connection
  socket.on("disconnect", () => {
    console.log("disconnected");
    Users.forEach((us) => {
      if (us.id === token) {
        us.online = false;
      }
    });
  });

  //! Save offer signal
  socket.on("saveSignalOffer", (signal) => {
    Users.map((ed) => {
      if (ed.id === token) {
        ed.signal = signal;
      }
    });
  });

  //! Get Offer signal using id
  socket.on("getSignalOffer", (id) => {
    const rec = Users.filter((el) => el.id === id);
    if (rec.length > 0) {
      if (rec[0].online === false) {
        // Tell client that creator is no longer active
        socket.emit("userOffline");
      } else {
        // Send peer object back to client

        socket.emit("getSignalDetails", rec[0].signal, rec[0].id);
      }
    } else {
      // Tell client that user does not exist
      socket.emit("invalidUser");
    }
  });

  //! Send peer response to sender
  socket.on("sendSignalAnswer", (signal, id) => {
    io.to(id).emit("sendSignalAnswer", signal, id);
  });
};
