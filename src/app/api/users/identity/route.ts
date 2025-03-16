import getDataFromToken from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userID = await getDataFromToken(request);
    const user = await prisma.users.findUnique({
      omit: {
        password: true,
      },
      where: { id: userID },
    });
    return NextResponse.json({ message: "User found", data: user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
