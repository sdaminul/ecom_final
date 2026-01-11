import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  await connectDB();
  const user = await User.findById(token.sub);

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Current password check
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return NextResponse.json({ message: "Password changed successfully" });
}
