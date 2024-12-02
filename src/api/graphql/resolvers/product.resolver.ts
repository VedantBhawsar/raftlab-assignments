import { redisClient } from "../../../config/redis.config";
import { IProduct } from "../../../interfaces";
import Product, { ECategory } from "../../../models/product.model";

interface ProductPayload {
  id?: string;
  name: string;
  description?: string;
  price: string;
  category: ECategory;
  stock?: string;
  userId: string;
}

const resolvers = {
  Query: {
    getAllProducts: async (): Promise<IProduct[]> => {
      let cachedProducts = await redisClient.get("products");
      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      }
      const products = await Product.find();
      await redisClient.set("products", JSON.stringify(products), {
        EX: 60,
      });
      return products;
    },
    getProductById: async (
      _: unknown,
      { productId }: { productId: string }
    ): Promise<IProduct | null> => {
      return await Product.findById(productId);
    },
  },

  Mutation: {
    createProduct: async (
      _: unknown,
      { payload }: { payload: ProductPayload },
      context: { user?: { id: string; isValid: boolean } }
    ): Promise<IProduct> => {
      if (!context.user) {
        throw new Error("Unauthorized: User is not valid.");
      }

      const py = {
        ...payload,
        price: Number(payload.price),
        stock: Number(payload.stock),
        userId: context.user.id,
      };

      let newProduct = new Product(py);
      newProduct = await newProduct.save();
      return newProduct;
    },

    updateProduct: async (
      _: unknown,
      { payload }: { id: string; payload: Partial<ProductPayload> },
      context: { user?: { id: string; isValid: boolean } }
    ): Promise<IProduct | null> => {
      if (!context.user) {
        throw new Error("Unauthorized: User is not valid.");
      }
      const product = await Product.findById(payload.id);
      if (product?.userId !== context.user.id) {
        throw new Error("Unauthorized: You are not the owner of this product.");
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        payload.id,
        payload,
        {
          new: true,
        }
      );
      if (!updatedProduct) {
        throw new Error("Product not found");
      }
      return updatedProduct;
    },
    deleteProduct: async (
      _: unknown,
      { productId }: { productId: string }
    ): Promise<string> => {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error("Product not found");
      }
      return `Product with ID ${productId} deleted successfully.`;
    },
  },
};

export default resolvers;
