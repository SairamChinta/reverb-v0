import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { reverbAuthOptions } from "@/app/lib/authOptions";
import { emitVoteUpdate } from "@/app/lib/socket";

const UpvoteSchema = z.object({
    streamId: z.string(),
})
export async function POST(req: NextRequest) {
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

    try {
        const data = UpvoteSchema.parse(await req.json());

        await prismaClient.upvote.delete({
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: data.streamId
                }
            }
        });

        // Get updated vote count
        const voteCount = await prismaClient.upvote.count({
            where: { streamId: data.streamId }
        });

        // Get stream to find userId for socket room
        const stream = await prismaClient.stream.findUnique({
            where: { id: data.streamId },
            select: { userId: true }
        });

        // Emit socket event for real-time update
        if (stream) {
            try {
                emitVoteUpdate(stream.userId, data.streamId, -1, voteCount);
            } catch (socketError) {
                console.error("Socket emission error:", socketError);
            }
        }

        return NextResponse.json({
            message: "Downvoted successfully",
            success: true
        });

    } catch (error) {
        console.error("Downvote error:", error);

        // Handle case where upvote doesn't exist
        if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
            return NextResponse.json({
                message: "You haven't upvoted this song yet"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Error while downvoting"
        }, { status: 500 });
    }
}