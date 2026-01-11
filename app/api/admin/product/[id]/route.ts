import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
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

    const colorVariants = JSON.parse(formData.get("colorVariants")?.toString() || "[]");
    const sizeVariants = JSON.parse(formData.get("sizeVariants")?.toString() || "[]");
    const existingImages = JSON.parse(formData.get("existingImages")?.toString() || "[]");

    // Handle new images
    const files = formData.getAll("images") as File[];
    const newImageUrls: string[] = [];

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        newImageUrls.push(`/uploads/${fileName}`);
      }
    }

    const finalImages = [...existingImages, ...newImageUrls];

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        price,
        originalPrice,
        category,
        images: finalImages,
        quantity,
        stockStatus,
        colorVariants,
        sizeVariants,
        weight,
        deliveryTime,
        sku,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Optional: Delete images from filesystem
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgUrl: string) => {
        const filePath = path.join(process.cwd(), "public", imgUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
