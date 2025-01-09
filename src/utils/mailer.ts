import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/user.model';
import mongoose from 'mongoose';

const createTransport = () => {
  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

interface LoginNotificationProps {
  email: string;
  name: string;
  browser?: string;
  os?: string;
  location?: string;
}

export const sendLoginNotification = async ({ 
  email, 
  name, 
  browser = 'Unknown',
  os = 'Unknown',
  location = 'Unknown'
}: LoginNotificationProps) => {
  try {
    const transport = createTransport();
    const loginTime = new Date().toLocaleString();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'New Login Detected',
      html: `
        <h1>New Login Alert</h1>
        <p>Hello ${name},</p>
        <p>We detected a new login to your account with the following details:</p>
        <ul>
          <li>Time: ${loginTime}</li>
          <li>Browser: ${browser}</li>
          <li>Operating System: ${os}</li>
          <li>Location: ${location}</li>
        </ul>
        <p>If this wasn't you, please secure your account immediately.</p>
      `
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending login notification:', error);
    throw error;
  }
};

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verificationToken: hashedToken,
        verificationTokenExpires: Date.now() + 3600000,
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: Date.now() + 3600000,
      });
    }

    const transport = createTransport();

    const emailTemplate = (type: 'VERIFY' | 'RESET', link: string) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${type === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
          }
          
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background-color: #2563eb;
            padding: 32px;
            text-align: center;
          }
          
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
          }
          
          .content {
            padding: 32px;
            color: #1f2937;
          }
          
          h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 24px;
            color: #1f2937;
          }
          
          p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 24px;
            color: #4b5563;
          }
          
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin: 8px 0;
          }
          
          .button:hover {
            background-color: #1d4ed8;
          }
          
          .notice {
            font-size: 14px;
            color: #6b7280;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer {
            background-color: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          
          @media only screen and (max-width: 600px) {
            .container {
              margin: 0;
              border-radius: 0;
            }
            
            .header, .content, .footer {
              padding: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">QR Service</h1>
          </div>
          
          <div class="content">
            <h1>${type === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password'}</h1>
            <p>Hello,</p>
            ${type === 'VERIFY' 
              ? `<p>Thank you for registering with QR Service. Please click the button below to verify your email address. This link is valid for 1 hour.</p>`
              : `<p>We received a request to reset your password. Click the button below to create a new password. This link is valid for 1 hour.</p>`
            }
            
            <a href="${link}" class="button">${type === 'VERIFY' ? 'Verify Email' : 'Reset Password'}</a>
            
            ${type === 'VERIFY'
              ? `<p>If you didn't create an account with QR Service, you can safely ignore this email.</p>`
              : `<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>`
            }
            
            <div class="notice">
              <p>For security reasons, this link will expire in 1 hour.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent by QR Service. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} QR Service. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create verify and reset links
    const domain = process.env.DOMAIN || 'http://localhost:3000';
    const link = emailType === 'VERIFY' 
      ? `${domain}/verifyemail?token=${hashedToken}`
      : `${domain}/auth/reset-password?token=${hashedToken}`;

    const mailOptions = {
      from: `QR Service <${process.env.SMTP_USER}>`,
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: emailTemplate(emailType, link),
    };

    const mailresponse = await transport.sendMail(mailOptions);
    console.log('Email sent successfully:', mailresponse.messageId);
    return mailresponse;
  } catch (error: any) {
    console.error('Error sending email:', error);
    return false;
  }
};
