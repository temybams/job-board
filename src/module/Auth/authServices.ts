import httpStatus from 'http-status';
import UserModel, { UserRole } from "../../Model/UserModel";
import { IUser } from "../../Model/UserModel";
import throwError from "../../types/error";
import bcrypt from "bcrypt";
import JWTService from "../../Utils/JWTGenerator";

// Service function to add a user
const authServices = {
  addUserService: async (data: IUser) => {
    const isUserExists = await UserModel.findOne({ email: data.email });
    if (isUserExists) {
      throwError("Email Already exists", httpStatus.CONFLICT);
    }

    const isFirstUser = (await UserModel.countDocuments()) === 0;
    data.role = isFirstUser ? UserRole.ADMIN : UserRole.USER;
    const newUser = new UserModel(data);
    const result = await newUser.save();

    const { password, ...userWithoutPassword } = result.toObject();
    return userWithoutPassword;
  },

  loginService: async (email: string, password: string) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throwError('User not found', httpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user!.password);

    if (!isMatch) {
      throwError('Invalid credentials', httpStatus.UNAUTHORIZED);
    }

    const token = JWTService.sign({ sub: user!._id, role: user!.role });
    return token;
  },
}

export default authServices;