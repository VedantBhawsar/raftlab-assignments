import mongoose, { Document, Schema, Model } from "mongoose";

export enum ECategory {
  "Electronics",
  "Clothing",
  "Furniture",
  "Books",
  "Others",
}

interface IProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
  category: ECategory;
  stock: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["Electronics", "Clothing", "Furniture", "Books", "Others"],
        message:
          "Category must be one of: Electronics, Clothing, Furniture, Books, Others",
      },
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product: Model<IProductDocument> = mongoose.model<IProductDocument>(
  "Product",
  productSchema
);

export default Product;
