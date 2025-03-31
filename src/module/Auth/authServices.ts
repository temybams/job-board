import httpStatus from 'http-status';
import { Response } from 'express';
import UserModel, { UserRole } from "../../Model/UserModel";
import { IUser } from "../../Model/UserModel";
import throwError from "../../types/error";
import bcrypt from "bcrypt";
import JWTService from "../../Utils/JWTGenerator";


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

  getMeService: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throwError('User not found', httpStatus.NOT_FOUND);
    }
    return user;

  },

  getAllUsersService: async () => {
    const users = await UserModel.find();
    return users;
  },

  updateUserService: async (userId: string, data: IUser) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throwError('User not found', httpStatus.NOT_FOUND);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      data,
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      throwError("Failed to update user", httpStatus.INTERNAL_SERVER_ERROR);
    }
    const { password, ...userWithoutPassword } = updatedUser!.toObject();
    return userWithoutPassword;

  },

  deleteUserService: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throwError('User not found', httpStatus.NOT_FOUND);
    }

    await UserModel.findByIdAndDelete(userId);
    return { message: 'User deleted successfully' };
  },

  deleteAllUsersService: async () => {
    const count = await UserModel.countDocuments();

    if (count === 0) {
      throwError("No users found", httpStatus.NOT_FOUND);
    }

    await UserModel.deleteMany({});
    return { message: "All users deleted successfully" };
  },

  logoutService: async (res: Response) => {
    res.cookie(process.env.COOKIE_SECRET!, "", {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  }

}

export default authServices;