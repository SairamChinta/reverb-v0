import { Server as HTTPServer } from "http";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/socket";
import { Server as SocketIOServer } from "socket.io";

export const config = {
    api: {
        bodyParser: false,
    },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log("🔌 Initializing Socket.io server...");

        const httpServer: HTTPServer = res.socket.server as any;
        const io = new SocketIOServer(httpServer, {
            path: "/api/socket",
            addTrailingSlash: false,
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
            transports: ["websocket", "polling"],
        });

        res.socket.server.io = io;

        // Store globally for API routes to access
        (global as any).io = io;

        io.on("connection", (socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.on("join-stream", (creatorId: string) => {
                if (!creatorId) return;

                socket.join(`stream:${creatorId}`);
                console.log(`Socket ${socket.id} joined stream:${creatorId}`);

                socket.emit("connected", {
                    message: "Connected to stream",
                    creatorId,
                });
            });

            socket.on("leave-stream", (creatorId: string) => {
                if (!creatorId) return;

                socket.leave(`stream:${creatorId}`);
                console.log(`Socket ${socket.id} left stream:${creatorId}`);
            });

            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

        console.log("Socket.io server initialized and stored globally");
    } else {
        console.log("Socket.io already running");
    }

    // Return some response to confirm connection
    res.status(200).json({
        success: true,
        message: "Socket.io initialized",
        initialized: !!(global as any).io
    });
};

export default SocketHandler;
