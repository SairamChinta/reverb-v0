import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export interface SocketServer extends HTTPServer {
    io?: SocketIOServer;
}

export interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

export interface NextApiResponseServerIO extends NextApiResponse {
    socket: SocketWithIO;
}
