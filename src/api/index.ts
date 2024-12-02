import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import JWTService from "../utils/jwt";
import { IGraphqlContext } from "../interfaces";
import userSchema from "./graphql/schemas/user.schema";
import productSchema from "./graphql/schemas/product.schema";
import userResolvers from "../api/graphql/resolvers/user.resolver";
import productResolvers from "../api/graphql/resolvers/product.resolver";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";

const query = `#graphql
  ${userSchema}
  ${productSchema}
`;

async function initServer() {
  const app = express();
  app.use(bodyParser.json());

  const graphqlServer = new ApolloServer<IGraphqlContext>({
    typeDefs: `#graphql
      ${query}

      type Query {
        getAllUsers: [User]
        getUser(userId: ID!): User
        getCurrentUser: User
        
        getAllProducts: [Product]
        getProductById(productId: ID!): Product
      }

      type Mutation {
        createUser(payload: CreateUserInput): String
        updateUser(id: ID!, payload: CreateUserInput): User
        deleteUser(id: ID!): String
        signin(email: String!, password: String!): String

        createProduct(payload: CreateProductData): Product
        updateProduct(payload: UpdateProductData): Product
        deleteProduct(productId: String!): String
      }
    `,
    resolvers: [userResolvers, productResolvers],
  });

  const httpServer = createServer(app);

  const socketServer = new SocketServer(httpServer);

  socketServer.on("connection", async (socket) => {
    console.log("Client connected", socket);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    // // Broadcasting to all connected clients.
    socket.on("send_message", (message) => {
      console.log(message);
      socketServer.emit("receive_message", message);
    });

    // Broadcasting to clients in a specific room
    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("send_message_to_room", (room, message) => {
      socketServer.to(room).emit("receive_message", message);
    });
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    cors({
      origin: "*",
      credentials: true,
    }),
    express.json(),
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        try {
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { user: null };
          }
          const token = authHeader.split(" ")[1];
          const decodedUser = JWTService.decodeToken(token);
          return { user: decodedUser };
        } catch (error) {
          console.error("Error decoding JWT:", error);
          return { user: null };
        }
      },
    })
  );

  return app;
}

export { initServer };
