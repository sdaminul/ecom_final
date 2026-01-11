import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Multipart form data parse
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const slug = formData.get("slug")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const price = Number(formData.get("price"));
    const originalPrice = Number(formData.get("originalPrice") || 0);
    const category = formData.get("category")?.toString() || "";
    const quantity = Number(formData.get("quantity") || 0);
    const stockStatus = formData.get("stockStatus")?.toString() || "In Stock";
    const weight = formData.get("weight")?.toString();
    const deliveryTime = Number(formData.get("deliveryTime") || 0);
    const sku = formData.get("sku")?.toString();

    // Color and Size variants (JSON string)
    const colorVariants = JSON.parse(formData.get("colorVariants")?.toString() || "[]");
    const sizeVariants = JSON.parse(formData.get("sizeVariants")?.toString() || "[]");

    // Handle images
    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${ext}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imageUrls.push(`/uploads/${fileName}`);
    }

    // Create product
    const product = await Product.create({
      name,
      slug,
      description,
      price,
      originalPrice,
      category,
      images: imageUrls,
      quantity,
      stockStatus,
      colorVariants,
      sizeVariants,
      weight,
      deliveryTime,
      sku,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
