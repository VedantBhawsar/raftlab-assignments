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
const user_model_1 = __importDefault(require("../../../models/user.model"));
const bcrypt_1 = require("../../../utils/bcrypt");
const jwt_1 = __importDefault(require("../../../utils/jwt"));
const resolvers = {
    Query: {
        getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield user_model_1.default.find();
            return users;
        }),
        getUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { userId }) {
            const user = yield user_model_1.default.findById(userId);
            return user;
        }),
        getCurrentUser: (parent, arg, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!id)
                return null;
            const user = yield user_model_1.default.findById(id);
            return user;
        }),
    },
    Mutation: {
        createUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { payload }) {
            const existingUserByEmail = yield user_model_1.default.findOne({ email: payload.email });
            if (existingUserByEmail) {
                throw new Error("User already exists.");
            }
            const existingUserByUserName = yield user_model_1.default.findOne({
                username: payload.username,
            });
            if (existingUserByUserName) {
                throw new Error("Username is taken.");
            }
            let newUser = new user_model_1.default(payload);
            newUser = yield newUser.save();
            const token = jwt_1.default.generateTokenForUser({
                _id: newUser._id,
                email: newUser.email,
            });
            console.log(token);
            return token;
        }),
        updateUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id, username, email, firstName, lastName, }) {
            const existingUser = yield user_model_1.default.findById(id);
            if (!existingUser) {
                throw new Error("User not found");
            }
            const payload = {};
            if (username)
                payload.username = username;
            if (firstName)
                payload.firstName = firstName;
            if (lastName)
                payload.lastName = lastName;
            if (email)
                payload.email = email;
            yield user_model_1.default.findByIdAndUpdate(id, payload);
            const updatedUser = yield user_model_1.default.findById(id);
            return updatedUser;
        }),
        deleteUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const user = yield user_model_1.default.findByIdAndDelete(id);
            if (!user) {
                return "User not found.";
            }
            return "User deleted successfully.";
        }),
        signin: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
            const user = yield user_model_1.default.findOne({ email: email });
            if (!user) {
                throw new Error("User not found");
            }
            const isValidPassword = yield (0, bcrypt_1.validatePassword)(user.password, password);
            if (!isValidPassword) {
                throw new Error("Invalid password");
            }
            const token = jwt_1.default.generateTokenForUser({
                _id: user._id,
                email: user.email,
            });
            return token;
        }),
    },
};
exports.default = resolvers;
