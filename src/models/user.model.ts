import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

// Interface for user document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  googleId?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  suspensionExpiresAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string | null;
  generateRefreshToken(): string | null;
}

// User Schema
const UserSchema: Schema = new Schema({

  name: {
    type: String,
    // required: true,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: String,
    default: "",
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  refreshToken: { type: String },
  isActive: {
    type: Boolean,
    default: true,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspensionReason: String,
  suspensionExpiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the user's password before saving
// UserSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error: any) {
//     console.error("Error hashing password:", error);
//     next(error);
//   }
// });

// // Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};

UserSchema.methods.generateAccessToken = function (): string | null {
  try {
    const tokenData = {
      id: this._id,
      email: this.email,
    };
    return jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    });
  } catch (error) {
    console.error("Error generating access token:", error);
    return null;
  }
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function (): string | null {
  try {
    const tokenData = { id: this._id };
    return jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    });
  } catch (error) {
    console.error("Error generating refresh token:", error);
    return null;
  }
};

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
