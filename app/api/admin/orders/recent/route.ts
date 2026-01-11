import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "email"); // only email

  // Map orders to include user email
  const mappedOrders = orders.map((o: any) => ({
    _id: o._id,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt,
    userEmail: o.user.email,
  }));

  return NextResponse.json(mappedOrders);
}
