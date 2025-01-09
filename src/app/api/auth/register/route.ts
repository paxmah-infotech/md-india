import dbConnect from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";
import Joi from "joi";
import bcrypt from "bcrypt";

function sanitizeUser(user: any) {
  const { password, ...safeUser } = user.toObject(); // Exclude sensitive information
  return safeUser;
}

// Define the user schema with only email, password, and name
const userSchema = Joi.object({
  email: Joi.string()
  .email({ tlds: { allow: true } })
    .required()
    .trim()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
    }),

    password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)"))
    .required()
    .messages({
      "string.pattern.base": "Password must include at least one letter and one number.",
      "string.min": "Password must be at least 8 characters long.",
      "string.empty": "Password is required.",
    }),

  });

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await request.json(); // Ensure this is awaited
    const { email, password } = reqBody;

    // Validate the input using Joi
    const { error, value } = userSchema.validate(
      { email, password },
      { abortEarly: false }
    );

    // Return validation errors if any
    if (error) {
      return NextResponse.json(
        {
          message: "Validation errors",
          errors: error.details.map((err: any) => err.message),
        },
        { status: 400 }
      );
    }

    // Check if the user already exists based on email
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    // Create a new user 
    const newUser = new User({
      email: value.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Send verification email
    await sendEmail({
      email: value.email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    const sanitizedUser = sanitizeUser(savedUser);
    return NextResponse.json(
      { message: "User created successfully", success: true, sanitizedUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
