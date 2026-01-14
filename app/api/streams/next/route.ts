import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { reverbAuthOptions } from "@/app/lib/authOptions";
import { emitSongChange } from "@/app/lib/socket";

export async function GET() {
    const session = await getServerSession(reverbAuthOptions);

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }

    const mostUpvotedStream = await prismaClient.stream.findFirst({
        where: {
            userId: user.id,
            played: false
        },
        orderBy: [
            {
                upvotes: {
                    _count: 'desc'
                }
            },
            {
                createAt: 'asc' //older songs first if upvotes are equal
            }
        ]
    });

    if (!mostUpvotedStream) {
        return NextResponse.json({
            stream: null,
            message: "No songs in queue"
        });
    }
    await Promise.all([
        prismaClient.currentStream.upsert({
            where: {
                userId: user.id
            },
            update: {
                userId: user.id,
                streamId: mostUpvotedStream.id
            },
            create: {
                userId: user.id,
                streamId: mostUpvotedStream.id
            }
        }),
        prismaClient.stream.update({
            where: {
                id: mostUpvotedStream.id
            },
            data: {
                played: true,
                playedTs: new Date()
            }
        })
    ]);

    // Emit socket event for real-time song change
    try {
        emitSongChange(user.id, mostUpvotedStream);
    } catch (socketError) {
        console.error("Socket emission error:", socketError);
    }

    return NextResponse.json({
        stream: mostUpvotedStream
    });
}
