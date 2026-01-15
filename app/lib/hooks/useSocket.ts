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

    // Use refs to store the latest callbacks without triggering reconnections
    const callbacksRef = useRef({
        onQueueUpdate,
        onVoteUpdate,
        onSongChange,
        onSongAdded,
    });

    // Update refs when callbacks change
    useEffect(() => {
        callbacksRef.current = {
            onQueueUpdate,
            onVoteUpdate,
            onSongChange,
            onSongAdded,
        };
    }, [onQueueUpdate, onVoteUpdate, onSongChange, onSongAdded]);

    const connect = useCallback(() => {
        if (socketRef.current?.connected) {
            return;
        }

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
            socket.emit("join-stream", creatorId);
        });

        socket.on("connected", (data) => {
        });

        socket.on("disconnect", (reason) => {
            setIsConnected(false);
        });

        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setReconnectAttempts((prev) => prev + 1);
        });

        // Event listeners - use wrapper functions that reference the latest callbacks
        socket.on("queue-update", (data) => {
            if (callbacksRef.current.onQueueUpdate) {
                callbacksRef.current.onQueueUpdate(data);
            }
        });

        socket.on("vote-update", (data) => {
            if (callbacksRef.current.onVoteUpdate) {
                callbacksRef.current.onVoteUpdate(data);
            }
        });

        socket.on("song-change", (data) => {
            if (callbacksRef.current.onSongChange) {
                callbacksRef.current.onSongChange(data);
            }
        });

        socket.on("song-added", (data) => {
            if (callbacksRef.current.onSongAdded) {
                callbacksRef.current.onSongAdded(data);
            }
        });

        return socket;
    }, [creatorId]); // Only depends on creatorId now!

    useEffect(() => {
        // First, trigger socket initialization by hitting the endpoint
        const initSocket = async () => {
            try {
                const response = await fetch("/api/socket");
                const data = await response.json();
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
