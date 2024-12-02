import { Document } from "mongoose";
import { ECategory } from "./models/product.model";

export interface IJWTUser {
  _id: string;
  email: string;
}

export interface IGraphqlContext {
  user?: IJWTUser;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IProduct {
  name: string;
  description?: string;
  price: number;
  category: ECategory;
  stock: number;
}
