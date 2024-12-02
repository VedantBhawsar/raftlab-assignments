"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = `#graphql
    input CreateProductData{
        name: String
        description: String
        price: Float
        category: String
        stock: Int
   }

   input UpdateProductData{
        name: String
        description: String
        price: Float
        category: String
        stock: Int
        id: ID!
   }


  type Product {
    _id: ID!
    name: String
    description: String
    price: Float
    category: String
    stock: Int
  }

`;
exports.default = schema;
