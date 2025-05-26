// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "../auth/[...nextauth]/route"
// // import prisma from "@/lib/prisma"
// import { prismaClient } from "@/app/lib/db";

// export async function GET() {
//   const session = await getServerSession(authOptions)

//   if (!session || !session.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const user = await prismaClient.user.findUnique({
//     where: { email: session.user.email },
//     select: {
//       id: true,
      
//       email: true,
      
//     }
//   })

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 })
//   }

//   return NextResponse.json({ user })
// }
// app/api/user/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prismaClient } from "@/app/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("API /user error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

