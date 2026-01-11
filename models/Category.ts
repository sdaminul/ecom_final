import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  image: { type: String }, // image URL
}, { timestamps: true });

// slug index is already defined in the schema with unique: true
CategorySchema.index({ parent: 1 });

const Category = models.Category || model("Category", CategorySchema);
export default Category;
