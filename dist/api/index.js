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
exports.initServer = initServer;
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const user_schema_1 = __importDefault(require("./graphql/schemas/user.schema"));
const product_schema_1 = __importDefault(require("./graphql/schemas/product.schema"));
const user_resolver_1 = __importDefault(require("../api/graphql/resolvers/user.resolver"));
const product_resolver_1 = __importDefault(require("../api/graphql/resolvers/product.resolver"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const query = `#graphql
  ${user_schema_1.default}
  ${product_schema_1.default}
`;
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        const graphqlServer = new server_1.ApolloServer({
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
            resolvers: [user_resolver_1.default, product_resolver_1.default],
        });
        const httpServer = (0, http_1.createServer)(app);
        const socketServer = new socket_io_1.Server(httpServer);
        socketServer.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
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
        }));
        yield graphqlServer.start();
        app.use("/graphql", (0, cors_1.default)({
            origin: "*",
            credentials: true,
        }), express_1.default.json(), (0, express4_1.expressMiddleware)(graphqlServer, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req, res }) {
                try {
                    const authHeader = req.headers.authorization;
                    if (!authHeader || !authHeader.startsWith("Bearer ")) {
                        return { user: null };
                    }
                    const token = authHeader.split(" ")[1];
                    const decodedUser = jwt_1.default.decodeToken(token);
                    return { user: decodedUser };
                }
                catch (error) {
                    console.error("Error decoding JWT:", error);
                    return { user: null };
                }
            }),
        }));
        return app;
    });
}
