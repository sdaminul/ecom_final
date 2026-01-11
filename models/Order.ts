import mongoose, { Schema, models, model } from "mongoose";

export interface IOrder {
  user: mongoose.Schema.Types.ObjectId;
  items: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;
