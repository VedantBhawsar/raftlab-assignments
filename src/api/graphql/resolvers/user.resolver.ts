import User from "../../../models/user.model";
import { IGraphqlContext, IUser } from "../../../interfaces";
import { validatePassword } from "../../../utils/bcrypt";
import JWTService from "../../../utils/jwt";

const resolvers = {
  Query: {
    getAllUsers: async () => {
      const users = await User.find();
      return users;
    },
    getUser: async (_: any, { userId }: { userId: string }) => {
      const user = await User.findById(userId);
      return user;
    },

    getCurrentUser: async (parent: any, arg: any, ctx: IGraphqlContext) => {
      const id = ctx.user?._id;
      if (!id) return null;

      const user = await User.findById(id);
      return user;
    },
  },

  Mutation: {
    createUser: async (_: any, { payload }: { payload: IUser }) => {
      const existingUserByEmail = await User.findOne({ email: payload.email });
      if (existingUserByEmail) {
        throw new Error("User already exists.");
      }
      const existingUserByUserName = await User.findOne({
        username: payload.username,
      });
      if (existingUserByUserName) {
        throw new Error("Username is taken.");
      }
      let newUser = new User(payload);
      newUser = await newUser.save();

      const token = JWTService.generateTokenForUser({
        _id: newUser._id as string,
        email: newUser.email,
      });

      console.log(token);

      return token;
    },

    updateUser: async (
      _: any,
      {
        id,
        username,
        email,
        firstName,
        lastName,
      }: {
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
      }
    ) => {
      const existingUser = await User.findById(id);

      if (!existingUser) {
        throw new Error("User not found");
      }

      const payload: any = {};

      if (username) payload.username = username;
      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;
      if (email) payload.email = email;

      await User.findByIdAndUpdate(id, payload);
      const updatedUser = await User.findById(id);
      return updatedUser;
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return "User not found.";
      }
      return "User deleted successfully.";
    },

    signin: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await validatePassword(user.password, password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      const token = JWTService.generateTokenForUser({
        _id: user._id as string,
        email: user.email,
      });
      return token;
    },
  },
};

export default resolvers;
