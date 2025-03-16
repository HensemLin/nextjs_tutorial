import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const userToken = await prisma.userToken.findFirst({
      where: { token: token, expiry: { gt: new Date() } },
      include: {
        user: true,
      },
    });

    if (!userToken) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    console.log(userToken);

    // Update the user's verification status
    const user = await prisma.users.update({
      where: { id: userToken.userId },
      data: {
        isVerified: true,
      },
    });

    return NextResponse.json({
      message: "Email verified successsfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
