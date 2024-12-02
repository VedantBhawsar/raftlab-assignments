"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_config_1 = require("../../../config/redis.config");
const product_model_1 = __importDefault(require("../../../models/product.model"));
const resolvers = {
    Query: {
        getAllProducts: () => __awaiter(void 0, void 0, void 0, function* () {
            let cachedProducts = yield redis_config_1.redisClient.get("products");
            if (cachedProducts) {
                return JSON.parse(cachedProducts);
            }
            const products = yield product_model_1.default.find();
            yield redis_config_1.redisClient.set("products", JSON.stringify(products), {
                EX: 60,
            });
            return products;
        }),
        getProductById: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { productId }) {
            return yield product_model_1.default.findById(productId);
        }),
    },
    Mutation: {
        createProduct: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { payload }, context) {
            if (!context.user) {
                throw new Error("Unauthorized: User is not valid.");
            }
            const py = Object.assign(Object.assign({}, payload), { price: Number(payload.price), stock: Number(payload.stock), userId: context.user.id });
            let newProduct = new product_model_1.default(py);
            newProduct = yield newProduct.save();
            return newProduct;
        }),
        updateProduct: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { payload }, context) {
            if (!context.user) {
                throw new Error("Unauthorized: User is not valid.");
            }
            const product = yield product_model_1.default.findById(payload.id);
            if ((product === null || product === void 0 ? void 0 : product.userId) !== context.user.id) {
                throw new Error("Unauthorized: You are not the owner of this product.");
            }
            const updatedProduct = yield product_model_1.default.findByIdAndUpdate(payload.id, payload, {
                new: true,
            });
            if (!updatedProduct) {
                throw new Error("Product not found");
            }
            return updatedProduct;
        }),
        deleteProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { productId }) {
            const deletedProduct = yield product_model_1.default.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error("Product not found");
            }
            return `Product with ID ${productId} deleted successfully.`;
        }),
    },
};
exports.default = resolvers;
