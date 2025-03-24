import mongoose, {Types,  Document, Schema } from "mongoose";
import bcrypt from "bcrypt";


export enum UserRole {
    ADMIN = "admin",
    RECRUITER = "recruiter",
    USER = "user",
}

 export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    location?: string;
    gender?: string;
    resume?: string;
    role?: UserRole;
    _id: Types.ObjectId;
  }


const UserSchema = new Schema<IUser>(
    {
        username: String,
        email: String,
        password: String,
        location: {
            type: String,
        },
        gender: {
            type: String,
        },
        role: {
            type: String,
            default: UserRole.USER,
    
        },
        resume: {
            type: String,
        },
    },
    { timestamps: true } 
);

// Hashing Password
UserSchema.pre("save", async function (next) {
    const password = this.password;
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = bcrypt.hashSync(password!, salt);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
