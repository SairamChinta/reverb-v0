import { Server as SocketIOServer } from "socket.io";

// Get the Socket.io instance that was set by the /api/socket route
export const getIOInstance = (): SocketIOServer | null => {
    if (typeof global !== 'undefined' && (global as any).io) {
        return (global as any).io;
    }
    return null;
};

// Event emitters for different actions
export const emitQueueUpdate = (creatorId: string, queue: any[]) => {
    const io = getIOInstance();
    if (!io) {
        console.warn("Socket.io not initialized yet, skipping queue-update");
        return;
    }

    io.to(`stream:${creatorId}`).emit("queue-update", {
        queue,
        timestamp: new Date().toISOString(),
    });
    console.log(`Emitted queue-update to stream:${creatorId}`);
};

export const emitVoteUpdate = (creatorId: string, streamId: string, delta: number, newCount: number) => {
    const io = getIOInstance();
    if (!io) {
        console.warn("Socket.io not initialized yet, skipping vote-update");
        return;
    }

    io.to(`stream:${creatorId}`).emit("vote-update", {
        streamId,
        delta,
        newCount,
        timestamp: new Date().toISOString(),
    });
    console.log(`Emitted vote-update to stream:${creatorId}: ${delta > 0 ? '+' : ''}${delta}`);
};

export const emitSongChange = (creatorId: string, currentSong: any) => {
    const io = getIOInstance();
    if (!io) {
        console.warn("Socket.io not initialized yet, skipping song-change");
        return;
    }

    io.to(`stream:${creatorId}`).emit("song-change", {
        currentSong,
        timestamp: new Date().toISOString(),
    });
    console.log(`Emitted song-change to stream:${creatorId}`);
};

export const emitSongAdded = (creatorId: string, song: any) => {
    const io = getIOInstance();
    if (!io) {
        console.warn("Socket.io not initialized yet, skipping song-added");
        return;
    }

    io.to(`stream:${creatorId}`).emit("song-added", {
        song,
        timestamp: new Date().toISOString(),
    });
    console.log(`Emitted song-added to stream:${creatorId}`);
};
