import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Use .select() to only fetch fields needed for the cards
    const products = await Product.find(query)
      .select("name slug price images category")
      .populate("category", "name")
      .lean();

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
