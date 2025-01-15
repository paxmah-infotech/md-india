import dbConnect from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";
import Joi from "joi";
import bcrypt from "bcrypt";

function sanitizeUser(user: any) {
  const { password, ...safeUser } = user.toObject();
  return safeUser;
}

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
  // Add CORS headers
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    await dbConnect();
    
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Validate input
    const { error, value } = userSchema.validate(
      { email, password },
      { abortEarly: false }
    );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation errors",
          errors: error.details.map((err: any) => err.message),
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      if(!existingUser.isVerified){
        return NextResponse.json(
          { success: false, message: "Your account is not verified yet. Please verify your account via email." },
          { 
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            }
          }
        );
      }
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    // Create user
    const newUser = new User({
      email: value.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Send verification email
    await sendEmail({ email: savedUser.email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json(
      { 
        success: true, 
        message: "Registration successful! A verification email has been sent to your address. Please note that it may take up to 10 minutes to receive the email due to server processing. The verification link will be valid for 24 hours.",
        user: sanitizeUser(savedUser)
      },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error: any) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Something went wrong", 
        error: error.message 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
