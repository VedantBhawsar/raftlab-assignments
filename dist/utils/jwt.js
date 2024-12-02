"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
class JWTService {
    static generateTokenForUser(user) {
        const playload = {
            _id: user === null || user === void 0 ? void 0 : user._id,
            email: user === null || user === void 0 ? void 0 : user.email,
        };
        const token = jsonwebtoken_1.default.sign(playload, jwtSecret, {
            expiresIn: "1D",
        });
        return token;
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = JWTService;
