import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-expect-error: This external api type is incorrect
import YouTubeSearch from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth/next";
//@@ts-expect-error: This external lib type is incorrect
import { reverbAuthOptions } from "@/app/api/auth/[...nextauth]/route";

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

const MAX_QUEUE_LEN = 20;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(reverbAuthOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    const data = CreateStreamSchema.parse(await req.json());

    const isYt = data.url.match(YT_REGEX);
    if (!isYt) {
      return NextResponse.json(
        { message: "Invalid YouTube URL format" },
        { status: 411 }
      );
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    let extractedId = data.url.split("?v=")[1];
    if (!extractedId) {
      const shortUrlMatch = data.url.match(/youtu\.be\/([\w-]+)/);
      if (shortUrlMatch) {
        extractedId = shortUrlMatch[1];
      }
    }

    if (!extractedId) {
      return NextResponse.json(
        { message: "Could not extract video ID" },
        { status: 411 }
      );
    }

    try {
      const res = await YouTubeSearch.GetVideoDetails(extractedId);

      if (!res || !res.thumbnail || !res.thumbnail.thumbnails) {
        console.error("YouTube API Error: Invalid response", res);
        return NextResponse.json(
          { message: "Error fetching video details from YouTube (invalid response)" },
          { status: 500 }
        );
      }

      const thumbnails = Array.isArray(res.thumbnail.thumbnails)
        ? res.thumbnail.thumbnails
        : [res.thumbnail.thumbnails];
      thumbnails.sort((a: { width: number }, b: { width: number }) =>
        a?.width < b?.width ? -1 : 1
      );

      const existingActiveStream = await prismaClient.stream.count({
        where: {
          userId: data.creatorId,
        },
      });

      if (existingActiveStream > MAX_QUEUE_LEN) {
        return NextResponse.json(
          { message: "Already at Limit" },
          { status: 411 }
        );
      }

      const stream = await prismaClient.stream.create({
        data: {
          userId: data.creatorId,
          addedById: user.id,
          url: data.url,
          extractedId,
          type: "Youtube",
          title: res.title ?? "Can't find Video Title",
          smallImg:
            (thumbnails.length > 1
              ? thumbnails[thumbnails.length - 2].url
              : thumbnails[0].url) ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfW0rOyWkv0OqfwFuljuVldoXEj5VitoWK5w&s",
          bigImg:
            thumbnails[0].url ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfW0rOyWkv0OqfwFuljuVldoXEj5VitoWK5w&s",
        },
      });

      return NextResponse.json({
        ...stream,
        haveUpvoted: false,
        upvotes: 0,
      });
    } catch (ytError) {
      console.error("YouTube API Error:", ytError);
      return NextResponse.json(
        { message: "Error fetching video details from YouTube" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General Error:", error);
    return NextResponse.json(
      { message: "Error while adding a stream" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(reverbAuthOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    const creatorId = req.nextUrl.searchParams.get("creatorId");
    if (!creatorId) {
      return NextResponse.json({ message: "Missing creatorId" }, { status: 400 });
    }

    const [streams, activeStream] = await Promise.all([
      prismaClient.stream.findMany({
        where: {
          userId: creatorId,
          played: false,
        },
        include: {
          _count: {
            select: {
              upvotes: true,
            },
          },
          upvotes: {
            where: {
              userId: user.id,
            },
          },
        },
      }),
      prismaClient.currentStream.findFirst({
        where: {
          userId: creatorId,
        },
        include: {
          stream: true,
        },
      }),
    ]);

    return NextResponse.json({
      streams: streams.map(({ _count, upvotes, ...rest }) => ({
        ...rest,
        upvotes: _count.upvotes,
        haveUpvoted: upvotes.length > 0,
      })),
      activeStream,
    });
  } catch (error) {
    console.error("General Error:", error);
    return NextResponse.json(
      { message: "Error fetching streams" },
      { status: 500 }
    );
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//--------------------------------
// import { prismaClient } from "@/app/lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// // @@ts-expect-error
// import youtubesearchapi from "youtube-search-api";
// import { YT_REGEX } from "@/app/lib/utils";
// import { getServerSession } from "next-auth";// @@ts-expect-error
// import { authOptions } from "@/app/api/auth/[...nextauth]";

// const CreateStreamSchema = z.object({
//     creatorId: z.string(),
//     url: z.string()
// });

// const MAX_QUEUE_LEN = 20;

// export async function POST(req: NextRequest) {
//     try {
//         const session = await getServerSession(authOptions);
//         if (!session?.user?.email) {
//             return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
//         }

//         const user = await prismaClient.user.findUnique({
//             where: { email: session.user.email }
//         });

//         if (!user) {
//             return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
//         }

//         const data = CreateStreamSchema.parse(await req.json());
//         if (!data.url.trim()) {
//             return NextResponse.json({ message: "YouTube link cannot be empty" }, { status: 400 });
//         }

//         const isYt = data.url.match(YT_REGEX);
//         if (!isYt) {
//             return NextResponse.json({ message: "Invalid YouTube URL format" }, { status: 400 });
//         }

//         const extractedId = data.url.split("?v=")[1];
//         const res = await youtubesearchapi.GetVideoDetails(extractedId);

//         // Check for duplicate song submission
//         if (user.id !== data.creatorId) {
//             const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//             const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

//             const recentStreams = await prismaClient.stream.findMany({
//                 where: {
//                     userId: data.creatorId,
                    
//                 }
//             });

//             if (recentStreams.some(stream => stream.extractedId === extractedId)) {
//                 return NextResponse.json({ message: "This song was already added in the last 10 minutes" }, { status: 429 });
//             }

//             const userStreams = recentStreams.filter(stream => stream.userId === user.id);
//             //const streamsLastTwoMinutes = userStreams.filter(stream => stream.createdAt >= twoMinutesAgo);

//         //     if (streamsLastTwoMinutes.length >= 2) {
//         //         return NextResponse.json({ message: "Rate limit exceeded: You can only add 2 songs per 2 minutes" }, { status: 429 });
//         //     }

//         //     if (recentStreams.length >= 5) {
//         //         return NextResponse.json({ message: "Rate limit exceeded: You can only add 5 songs per 10 minutes" }, { status: 429 });
//         //     }
//         // }

//         const thumbnails = res.thumbnail.thumbnails;
//         thumbnails.sort((a: { width: number }, b: { width: number }) => (a.width < b.width ? -1 : 1));

//         const existingActiveStreams = await prismaClient.stream.count({
//             where: { userId: data.creatorId, played: false }
//         });

//         if (existingActiveStreams >= MAX_QUEUE_LEN) {
//             return NextResponse.json({ message: "Queue is full" }, { status: 429 });
//         }

//         const stream = await prismaClient.stream.create({
//             data: {
//                 userId: data.creatorId,
//                 url: data.url,
//                 extractedId,
//                 type: "Youtube",
//                 addedById: user.id,
//                 title: res.title ?? "Can't find video",
//                 smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "",
//                 bigImg: thumbnails[thumbnails.length - 1].url ?? "",
//                 haveUpvoted: false,
//                 upvotes: 0
//             }
//         });

//         return NextResponse.json({ message: "Stream added successfully", stream });
//     } catch (e) {
//         console.error(e);
//         return NextResponse.json({ message: "Error while adding a stream" }, { status: 500 });
//     }
// }

// export async function GET(req: NextRequest) {
//     try {
//         const creatorId = req.nextUrl.searchParams.get("creatorId");
//         const session = await getServerSession(authOptions);

//         if (!session?.user?.email) {
//             return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
//         }

//         const user = await prismaClient.user.findUnique({
//             where: { email: session.user.email }
//         });

//         if (!user) {
//             return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
//         }

//         const [streams, activeStream] = await Promise.all([
//             prismaClient.stream.findMany({
//                 where: { userId: creatorId, played: false },
//                 include: {
//                     _count: { select: { upvotes: true } },
//                     upvotes: { where: { userId: user.id } }
//                 }
//             }),
//             prismaClient.currentStream.findFirst({
//                 where: { userId: creatorId },
//                 include: { stream: true }
//             })
//         ]);

//         const isCreator = user.id === creatorId;

//         return NextResponse.json({
//             streams: streams.map(({ _count, ...rest }) => ({
//                 ...rest,
//                 upvotes: _count.upvotes,
//                 haveUpvoted: rest.upvotes.length > 0
//             })),
//             activeStream,
//             creatorId,
//             isCreator
//         });
//     } catch (e) {
//         console.error(e);
//         return NextResponse.json({ message: "Error fetching streams" }, { status: 500 });
//     }
// }
