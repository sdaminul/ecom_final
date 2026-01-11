import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { generateSlug } from "@/lib/utils";
import fs from "fs";
import path from "path";

// GET categories
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categories = await Category.find().populate("parent");
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("GET Category Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST create category
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const parentId = formData.get("parentId") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

    await connectDB();

    // handle image
    let imagePath = "";
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const fullPath = path.join(uploadDir, fileName);
      fs.writeFileSync(fullPath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const slug = generateSlug(name);

    const existing = await Category.findOne({ slug });
    if (existing) return NextResponse.json({ message: "Category already exists" }, { status: 409 });

    const category = await Category.create({
      name,
      slug,
      parent: parentId || null,
      image: imagePath || "",
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Category id is required" }, { status: 400 });

    await connectDB();
    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// UPDATE category
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const parentId = formData.get("parentId") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id || !name) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await connectDB();

    const updateData: any = {
      name,
      slug: generateSlug(name),
      parent: parentId || null,
    };

    // image update (optional)
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      updateData.image = `/uploads/${fileName}`;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("UPDATE Category Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
