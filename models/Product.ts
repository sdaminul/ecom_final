import mongoose, { Schema, models, model } from "mongoose";
import "@/models/Category";

/* =====================
   Variant Interfaces
===================== */
export interface IColorVariant {
  name: string;
  hex: string;
}

export interface ISizeVariant {
  sizeName?: string;
  measurements?: string;
}

/* =====================
   Product Interface
===================== */
export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: mongoose.Schema.Types.ObjectId;
  images: string[];
  quantity?: number;
  stockStatus?: "In Stock" | "Out of Stock" | "Upcoming";
  colorVariants?: IColorVariant[];
  sizeVariants?: ISizeVariant[];
  weight?: string;
  deliveryTime?: number;
  sku?: string;
}

/* =====================
   Schemas
===================== */
const ColorVariantSchema = new Schema<IColorVariant>(
  {
    name: { type: String },
    hex: { type: String },
  },
  { _id: false }
);

const SizeVariantSchema = new Schema<ISizeVariant>(
  {
    sizeName: { type: String },
    measurements: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    originalPrice: { type: Number },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [{ type: String }],
    quantity: { type: Number },

    stockStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Upcoming"],
      default: "In Stock",
    },

    colorVariants: [ColorVariantSchema],
    sizeVariants: [SizeVariantSchema],

    weight: { type: Number },
    deliveryTime: { type: Number },
    sku: { type: String },
  },
  { timestamps: true }
);

// Add indexes for faster queries
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ category: 1 });
// slug index is already defined in the schema with unique: true
ProductSchema.index({ name: "text", description: "text" });

const Product =
  models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
