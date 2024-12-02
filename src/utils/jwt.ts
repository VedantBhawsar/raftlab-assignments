import { IJWTUser } from "../interfaces";
import jwt from "jsonwebtoken";

interface User {
  _id: string;
  email: string;
}

const jwtSecret = process.env.JWT_SECRET as string;

class JWTService {
  public static generateTokenForUser(user: User) {
    const playload: IJWTUser = {
      _id: user?._id,
      email: user?.email,
    };
    const token = jwt.sign(playload, jwtSecret, {
      expiresIn: "1D",
    });
    return token;
  }

  public static decodeToken(token: string) {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (error) {
      return null;
    }
  }
}

export default JWTService;
