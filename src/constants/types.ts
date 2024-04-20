import { Server } from "socket.io";

export interface ServerToClientEvents {
  invalidUser: () => void;
  userOffline: () => void;
  getSignalDetails: (signal: any, id: string) => void;
  sendSignalAnswer: (signal: any, id: string) => void;
  ttees: () => void;
}

export interface ClientToServerEvents {
  saveSignalOffer: (signal: any) => void;
  getSignalOffer: (id: string) => void;
  sendSignalAnswer: (signal: any, id: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {}

export interface UserType {
  id: string;
  online: boolean;
  signal: any;
}
