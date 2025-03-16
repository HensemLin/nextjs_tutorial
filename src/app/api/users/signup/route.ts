import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/db";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("reqBody: ", reqBody);

    //check if user already exists
    const user = await prisma.users.findUnique({
      where: { username: username, email: email },
    });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.users.create({
      data: { username: username, password: hashedPassword, email: email },
    });
    console.log("newUser: ", newUser);

    // send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: newUser.id });

    return NextResponse.json({
      message: "User created successsfully",
      success: true,
      newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
