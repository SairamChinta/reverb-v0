import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
    creatorId: string;
    onQueueUpdate?: (data: { queue: any[]; timestamp: string }) => void;
    onVoteUpdate?: (data: { streamId: string; delta: number; newCount: number; timestamp: string }) => void;
    onSongChange?: (data: { currentSong: any; timestamp: string }) => void;
    onSongAdded?: (data: { song: any; timestamp: string }) => void;
}

export const useSocket = ({
    creatorId,
    onQueueUpdate,
    onVoteUpdate,
    onSongChange,
    onSongAdded,
}: UseSocketOptions) => {
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const socketRef = useRef<Socket | null>(null);

    const connect = useCallback(() => {
        if (socketRef.current?.connected) {
            console.log("Socket already connected");
            return;
        }

        console.log("Connecting to Socket.io...");

        const socket = io(window.location.origin, {
            path: "/api/socket",
            transports: ["polling", "websocket"], // Try polling first
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            setIsConnected(true);
            setReconnectAttempts(0);

            // Join the stream room
            console.log(`Joining stream:${creatorId}`);
            socket.emit("join-stream", creatorId);
        });

        socket.on("connected", (data) => {
            console.log("Connected to stream:", data);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            setIsConnected(false);
        });

        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setReconnectAttempts((prev) => prev + 1);
        });

        // Event listeners
        if (onQueueUpdate) {
            socket.on("queue-update", onQueueUpdate);
        }

        if (onVoteUpdate) {
            socket.on("vote-update", onVoteUpdate);
        }

        if (onSongChange) {
            socket.on("song-change", onSongChange);
        }

        if (onSongAdded) {
            socket.on("song-added", onSongAdded);
        }

        return socket;
    }, [creatorId, onQueueUpdate, onVoteUpdate, onSongChange, onSongAdded]);

    useEffect(() => {
        // First, trigger socket initialization by hitting the endpoint
        const initSocket = async () => {
            try {
                console.log("Triggering Socket.io initialization...");
                const response = await fetch("/api/socket");
                const data = await response.json();
                console.log("Socket.io init response:", data);

                // Small delay to ensure server is ready
                setTimeout(() => {
                    connect();
                }, 100);
            } catch (error) {
                console.error("Failed to initialize socket:", error);
                // Try connecting anyway
                connect();
            }
        };

        initSocket();

        return () => {
            if (socketRef.current) {
                console.log("Cleaning up socket connection");
                socketRef.current.emit("leave-stream", creatorId);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [connect, creatorId]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit("leave-stream", creatorId);
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, [creatorId]);

    return {
        socket: socketRef.current,
        isConnected,
        reconnectAttempts,
        disconnect,
    };
};
