import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// POST: Place Order (User)
export async function POST(req: NextRequest) {
  // Get JWT token from request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { items, total } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.create({
    user: token.sub,
    items,
    total,
    status: "Pending",
  });

  return NextResponse.json({ orderId: order._id, message: "Order placed" }, { status: 201 });
}

// GET: Get All Orders for Logged-in User
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const orders = await Order.find({ user: token.sub }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
