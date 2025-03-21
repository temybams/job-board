import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
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
            enum: ["admin", "recruiter", "user"],
            default: "user",
        },
        resume: {
            type: String,
        },
    },
    { timestamps: true } // to keep track
);

// Hashing Password
UserSchema.pre("save", async function (next) {
    const password = this.password;
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = bcrypt.hashSync(password, salt);
    this.password = hashedPassword;
    next();
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
