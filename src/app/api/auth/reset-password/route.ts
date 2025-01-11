import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '@/models/user.model'
import bcrypt from 'bcrypt'
import dbConnect from '@/dbConfig/dbConfig'
import { sendEmail } from '@/utils/mailer'

// Ensure MongoDB connection is established
dbConnect()

export async function POST(request: NextRequest) {
  try {
    const { token, password, email, type } = await request.json()
    console.log('type:', type)
    console.log('email:', email)

    if (type === 'request') {
      // Handle password reset request
      if (!email) {
        return NextResponse.json(
          { success: false, message: 'Email is required.' },
          { status: 400 }
        )
      }

      const user = await User.findOne({ email })
      // console.log("user:", user)

      if (!user) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'No account found with this email address.' 
          },
          { status: 404 }
        )
      }

      const emailSent = await sendEmail({
        email: user.email,
        emailType: 'RESET',
        userId: user._id
      });

      if (!emailSent) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to send reset email. Please try again later.' 
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'Password reset instructions have been sent to your email.' 
        },
        { status: 200 }
      )

    } else if (type === 'reset') {
      // Handle password reset
      if (!token || !password) {
        return NextResponse.json(
          { success: false, message: 'Token and password are required.' },
          { status: 400 }
        )
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired reset token.' },
          { status: 400 }
        )
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      user.password = hashedPassword
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      return NextResponse.json(
        { success: true, message: 'Password successfully reset.' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid request type.' },
        { status: 400 }
      )
    }
  } catch (error) {
    // console.error('Error processing request:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
