import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// @ts-expect-error - authOptions typing mismatch
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

        // Check if stream exists
        const stream = await prismaClient.stream.findUnique({
            where: { id: data.streamId }
        });

        if (!stream) {
            return NextResponse.json(
                { message: "Stream not found" },
                { status: 404 }
            );
        }

        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        });

        // Get updated vote count
        const voteCount = await prismaClient.upvote.count({
            where: { streamId: data.streamId }
        });

        // Emit socket event for real-time update
        try {
            emitVoteUpdate(stream.userId, data.streamId, +1, voteCount);
        } catch (socketError) {
            console.error("Socket emission error:", socketError);
        }

        return NextResponse.json({
            message: "Upvoted successfully",
            success: true
        });

    } catch (error) {
        console.error("Upvote error:", error);

        // Handle duplicate upvote (unique constraint violation)
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json({
                message: "You have already upvoted this song"
            }, { status: 409 });
        }

        return NextResponse.json({
            message: "Error while upvoting"
        }, { status: 500 });
    }
}